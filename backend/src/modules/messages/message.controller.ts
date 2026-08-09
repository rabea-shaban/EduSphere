import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Message } from './message.model';
import { Conversation } from '../conversations/conversation.model';
import { emitToConversation } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Async persistence helper for HTTP path — mirrors socket.ts persistMessage.
 * Called via setImmediate so it never blocks the HTTP response.
 */
async function persistMessageFromHttp(envelope: {
  _id: string;
  clientMessageId?: string;
  conversationId: string;
  senderId: string;
  message: string;
  messageType: string;
  attachments: string[];
  replyTo?: string;
  participantIds: string[];
}, retryCount = 0): Promise<void> {
  const logCtx = {
    messageId: envelope._id,
    clientMessageId: envelope.clientMessageId,
    conversationId: envelope.conversationId,
    senderId: envelope.senderId,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log('[CHAT][PERSIST_START]', logCtx);

    // Idempotency check
    if (envelope.clientMessageId) {
      const existing = await Message.findOne({
        conversationId: envelope.conversationId,
        senderId: envelope.senderId,
        clientMessageId: envelope.clientMessageId,
      }).lean() as any;

      if (existing) {
        console.log('[CHAT][PERSIST_IDEMPOTENT] Already persisted (HTTP path).', logCtx);
        return;
      }
    }

    const msg = await Message.create({
      _id: new Types.ObjectId(envelope._id),
      conversationId: envelope.conversationId,
      senderId: envelope.senderId,
      clientMessageId: envelope.clientMessageId,
      message: envelope.message || '',
      messageType: (envelope.messageType || 'Text') as 'Text' | 'Image' | 'Video' | 'Audio' | 'Document' | 'System',
      attachments: envelope.attachments || [],
      replyTo: envelope.replyTo || undefined,
      status: 'persisted' as 'sent' | 'delivered' | 'read' | 'delivering' | 'persisted',
      isRead: false,
      seenBy: [{ userId: envelope.senderId, seenAt: new Date() }],
    });

    const conversation = await Conversation.findById(envelope.conversationId);
    if (conversation) {
      const unreadMap = conversation.unreadCount || new Map();
      envelope.participantIds.forEach((pId) => {
        if (pId !== envelope.senderId) {
          unreadMap.set(pId, (unreadMap.get(pId) || 0) + 1);
        }
      });
      conversation.unreadCount = unreadMap;
      conversation.lastMessage = msg._id as any;
      conversation.lastSender = envelope.senderId as any;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    console.log('[CHAT][PERSIST_SUCCESS]', logCtx);

    // Notify sender of durable persistence
    const io = require('../../config/socket').getIO();
    if (io && envelope.clientMessageId) {
      io.to(envelope.senderId).emit('chat:message:persisted', {
        clientMessageId: envelope.clientMessageId,
        messageId: msg._id.toString(),
        conversationId: envelope.conversationId,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    if (err?.code === 11000) {
      console.log('[CHAT][PERSIST_IDEMPOTENT] Duplicate key (HTTP path).', logCtx);
      return;
    }
    console.error('[CHAT][PERSIST_FAILED]', { ...logCtx, error: err?.message });
    if (retryCount === 0) {
      console.log('[CHAT][PERSIST_RETRY] Retrying in 2s...', logCtx);
      setTimeout(() => persistMessageFromHttp(envelope, 1), 2000);
    } else {
      console.error('[CHAT][PERSIST_FAILED_FINAL] Giving up after retry.', logCtx);
    }
  }
}

/**
 * Send a message in a conversation — Realtime-First.
 * Emits to recipient immediately, persists asynchronously.
 */
export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { conversationId, message, messageType, attachments, replyTo, clientMessageId } = req.body;
  const senderId = req.user?._id;

  if (!senderId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // 1. Verify conversation exists and sender is participant
  const conversation = await Conversation.findById(conversationId)
    .select('participants')
    .lean();

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  const participantIds: string[] = conversation.participants.map((p: any) => p.toString());
  const senderIdStr = senderId.toString();

  if (!participantIds.includes(senderIdStr)) {
    throw new ApiError(403, 'You are not a participant in this conversation');
  }

  // 2. Auto-detect messageType
  let resolvedMessageType = messageType || 'Text';
  if (attachments && attachments.length > 0 && (!messageType || messageType === 'Text')) {
    const ext = attachments[0].split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) resolvedMessageType = 'Image';
    else if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) resolvedMessageType = 'Video';
    else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) resolvedMessageType = 'Audio';
    else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt'].includes(ext)) resolvedMessageType = 'Document';
  }

  // 3. Pre-generate messageId so recipient gets the real Mongo _id immediately
  const messageId = new Types.ObjectId();

  // 4. Build the message envelope (matches socket envelope shape)
  const senderUser = req.user as any;
  const envelope = {
    _id: messageId.toString(),
    clientMessageId,
    conversationId,
    senderId: {
      _id: senderIdStr,
      firstName: senderUser?.firstName || '',
      lastName: senderUser?.lastName || '',
      avatar: senderUser?.avatar || null,
      role: senderUser?.role || 'STUDENT',
    },
    message: message || '',
    messageType: resolvedMessageType,
    attachments: attachments || [],
    replyTo: replyTo || undefined,
    status: 'delivered',
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const io = require('../../config/socket').getIO();

  console.log('[CHAT][SERVER_EMIT] (HTTP path)', {
    messageId: envelope._id,
    conversationId,
    senderId: senderIdStr,
    timestamp: Date.now(),
    socketCount: io?.sockets.adapter.rooms.get(conversationId?.toString())?.size || 0,
  });

  // 5. Emit to conversation room immediately
  emitToConversation(conversationId, 'chat:message:receive', envelope);
  emitToConversation(conversationId, 'message:new', envelope); // backward compat

  // 6. Emit to each participant's personal room (guarantees delivery even if room not joined)
  participantIds.forEach((pId) => {
    if (pId !== senderIdStr && io) {
      io.to(pId).emit('chat:message:receive', envelope);
      io.to(pId).emit('message:new', envelope); // backward compat
    }
  });

  // 7. Return 202 Accepted immediately — persistence is async
  res.status(202).json(new ApiResponse(202, envelope, 'Message accepted for delivery'));

  // 8. Persist asynchronously — never blocks the response
  setImmediate(() => persistMessageFromHttp({
    _id: envelope._id,
    clientMessageId,
    conversationId,
    senderId: senderIdStr,
    message: message || '',
    messageType: resolvedMessageType,
    attachments: attachments || [],
    replyTo,
    participantIds,
  }));
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
