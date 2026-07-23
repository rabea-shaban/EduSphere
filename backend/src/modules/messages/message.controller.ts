import { Request, Response } from 'express';
import { Message } from './message.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Send a private message (Real-time dispatch).
 */
export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { receiverId, message, attachments, messageType } = req.body;
  const senderId = req.user?._id;

  if (!senderId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Generate deterministic composite conversation ID
  const conversationId = [senderId.toString(), receiverId.toString()].sort().join('_');

  const msg = await Message.create({
    conversationId,
    senderId,
    receiverId,
    message,
    attachments: attachments || [],
    messageType: messageType || 'Text',
  });

  // Emit in real-time to recipient's Socket.io room
  emitToUser(receiverId, 'message', msg);

  res.status(201).json(new ApiResponse(201, msg, 'Message sent successfully'));
});

/**
 * Mark all messages in a conversation as seen (triggers read-receipts).
 */
export const markConversationSeen = catchAsync(async (req: Request, res: Response) => {
  const { otherUserId } = req.params;
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const conversationId = [currentUserId.toString(), otherUserId.toString()].sort().join('_');
  const now = new Date();

  // Mark all unread messages received from the other user as read
  await Message.updateMany(
    { conversationId, senderId: otherUserId, isSeen: false },
    { $set: { isSeen: true, seenAt: now } }
  );

  // Emit a real-time read-receipt event to the other user
  emitToUser(otherUserId, 'read-receipt', {
    conversationId,
    seenBy: currentUserId,
    seenAt: now,
  });

  res.status(200).json(new ApiResponse(200, null, 'Conversation marked as seen'));
});

/**
 * Get message history of a conversation.
 */
export const getConversation = catchAsync(async (req: Request, res: Response) => {
  const { otherUserId } = req.params;
  const currentUserId = req.user?._id;
  const { page = 1, limit = 20 } = req.query;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const conversationId = [currentUserId.toString(), otherUserId.toString()].sort().join('_');

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'firstName lastName avatar')
    .populate('receiverId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Message.countDocuments({ conversationId });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        messages,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Conversation logs retrieved successfully'
    )
  );
});
