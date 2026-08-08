import { Request, Response } from 'express';
import { Message } from './message.model';
import { Conversation } from '../conversations/conversation.model';
import { emitToConversation } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Send a message in a conversation (real-time & persistent).
 */
export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { conversationId, message, messageType, attachments, replyTo, clientMessageId } = req.body;
  const senderId = req.user?._id;

  if (!senderId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // 1. Verify conversation exists and sender is participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === senderId.toString()
  );
  if (!isParticipant) {
    throw new ApiError(403, 'You are not a participant in this conversation');
  }

  // 2. Auto-detect messageType based on attachments if not explicitly set
  let resolvedMessageType = messageType || 'Text';
  if (attachments && attachments.length > 0 && (!messageType || messageType === 'Text')) {
    const firstAttachment: string = attachments[0];
    const ext = firstAttachment.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      resolvedMessageType = 'Image';
    } else if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) {
      resolvedMessageType = 'Video';
    } else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
      resolvedMessageType = 'Audio';
    } else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt'].includes(ext)) {
      resolvedMessageType = 'Document';
    }
  }

  // 3. Create & Save Message in MongoDB
  const msg = await Message.create({
    conversationId,
    senderId,
    clientMessageId,
    message: message || '',
    messageType: resolvedMessageType,
    attachments: attachments || [],
    replyTo,
    status: 'sent',
    isRead: false,
    seenBy: [{ userId: senderId, seenAt: new Date() }],
  });

  // 3. Update Conversation lastMessage, lastSender & unreadCount map
  const unreadMap = conversation.unreadCount || new Map();
  conversation.participants.forEach((participantId) => {
    const pStr = participantId.toString();
    if (pStr !== senderId.toString()) {
      const current = unreadMap.get(pStr) || 0;
      unreadMap.set(pStr, current + 1);
    }
  });

  conversation.unreadCount = unreadMap;
  conversation.lastMessage = msg._id as any;
  conversation.lastSender = senderId as any;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // 4. Emit canonical message:new event to conversation room
  const populatedMsg = await msg.populate('senderId', 'firstName lastName avatar role');

  // Single canonical emission path to conversation room
  const io = require('../../config/socket').getIO();
  console.log("[PROOF][CHAT][SERVER_EMIT]", {
    messageId: populatedMsg._id,
    conversationId,
    senderId,
    timestamp: Date.now(),
    room: conversationId,
    socketCount: io?.sockets.adapter.rooms.get(conversationId.toString())?.size || 0,
  });

  emitToConversation(conversationId, 'message:new', populatedMsg);

  res.status(201).json(new ApiResponse(201, populatedMsg, 'Message sent successfully'));
});

/**
 * Mark all unread messages in a conversation as read by current user.
 */
export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  // Reset unread count for current user
  if (conversation.unreadCount) {
    conversation.unreadCount.set(currentUserId.toString(), 0);
    await conversation.save();
  }

  // Mark all messages from other participants as read
  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: currentUserId },
      isRead: false,
    },
    {
      $set: { isRead: true, status: 'read' },
      $addToSet: { seenBy: { userId: currentUserId, seenAt: new Date() } },
    }
  );

  // Emit read event to conversation room
  emitToConversation(conversationId, 'messages-read', {
    conversationId,
    readBy: currentUserId,
    readAt: new Date(),
  });

  res.status(200).json(new ApiResponse(200, { conversationId }, 'Messages marked as read'));
});

/**
 * Edit a specific message.
 */
export const editMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;
  const currentUserId = req.user?._id;

  const msg = await Message.findById(id);
  if (!msg) {
    throw new ApiError(404, 'Message not found');
  }

  if (msg.senderId.toString() !== currentUserId?.toString()) {
    throw new ApiError(403, 'You can only edit your own messages');
  }

  msg.message = message;
  msg.edited = true;
  msg.editedAt = new Date();
  await msg.save();

  const populated = await msg.populate('senderId', 'firstName lastName avatar role');
  emitToConversation(msg.conversationId.toString(), 'message-edited', populated);

  res.status(200).json(new ApiResponse(200, populated, 'Message edited successfully'));
});

/**
 * Delete message for current user only (Soft Hide).
 */
export const deleteMessageForMe = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?._id;

  const msg = await Message.findById(id);
  if (!msg) {
    throw new ApiError(404, 'Message not found');
  }

  if (!msg.deletedFor.includes(currentUserId as any)) {
    msg.deletedFor.push(currentUserId as any);
    await msg.save();
  }

  res.status(200).json(new ApiResponse(200, null, 'Message deleted for you'));
});

/**
 * Delete message for everyone (Sender or Admin/SuperAdmin).
 */
export const deleteMessageForEveryone = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?._id;
  const currentUserRole = req.user?.role;

  const msg = await Message.findById(id);
  if (!msg) {
    throw new ApiError(404, 'Message not found');
  }

  const isOwner = msg.senderId.toString() === currentUserId?.toString();
  const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'غير مصرح لك بحذف هذه الرسالة');
  }

  const conversationId = msg.conversationId.toString();
  await msg.deleteOne();

  emitToConversation(conversationId, 'message-deleted', { messageId: id, conversationId });

  res.status(200).json(new ApiResponse(200, null, 'Message deleted for everyone'));
});

/**
 * Toggle emoji reaction on a message
 */
export const toggleReaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const currentUserId = req.user?._id;

  if (!currentUserId || !emoji) {
    throw new ApiError(400, 'Missing message ID or emoji');
  }

  const msg = await Message.findById(id);
  if (!msg) {
    throw new ApiError(404, 'Message not found');
  }

  msg.reactions = msg.reactions || [];
  const existingIdx = msg.reactions.findIndex(
    (r) => r.userId.toString() === currentUserId.toString() && r.emoji === emoji
  );

  if (existingIdx > -1) {
    // Remove existing reaction
    msg.reactions.splice(existingIdx, 1);
  } else {
    // Add new reaction (limit 1 emoji type per user or replace)
    msg.reactions = msg.reactions.filter((r) => r.userId.toString() !== currentUserId.toString());
    msg.reactions.push({
      userId: currentUserId as any,
      emoji,
      createdAt: new Date(),
    });
  }

  await msg.save();
  const populated = await msg.populate('senderId', 'firstName lastName avatar role');

  emitToConversation(msg.conversationId.toString(), 'message-reaction', {
    messageId: msg._id,
    conversationId: msg.conversationId,
    reactions: populated.reactions,
  });

  return res.status(200).json(new ApiResponse(200, populated, 'Reaction updated'));
});

/**
 * Search messages inside a specific conversation
 */
export const searchMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { q = '' } = req.query;
  const currentUserId = req.user?._id;

  if (!currentUserId) throw new ApiError(401, 'Unauthorized');
  if (!q) return res.status(200).json(new ApiResponse(200, [], 'Empty query'));

  const searchRegex = new RegExp(String(q).trim(), 'i');

  const messages = await Message.find({
    conversationId,
    deletedFor: { $ne: currentUserId },
    message: searchRegex,
  })
    .populate('senderId', 'firstName lastName avatar role')
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return res.status(200).json(new ApiResponse(200, messages, 'Message search results'));
});

/**
 * Retrieve messages of a specific conversation (ignores messages hidden via deletedFor).
 */
export const getConversationMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const currentUserId = req.user?._id;
  const { page = 1, limit = 50 } = req.query;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === currentUserId.toString()
  );
  if (!isParticipant) {
    throw new ApiError(403, 'You do not have access to this conversation');
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    conversationId,
    deletedFor: { $ne: currentUserId },
  };

  const messages = await Message.find(filter)
    .populate('senderId', 'firstName lastName avatar role')
    .populate({
      path: 'replyTo',
      select: 'message senderId messageType',
      populate: { path: 'senderId', select: 'firstName lastName' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Message.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Messages retrieved successfully'
    )
  );
});
