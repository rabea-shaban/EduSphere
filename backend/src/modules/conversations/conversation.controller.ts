import { Request, Response } from 'express';
import { Conversation } from './conversation.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import { Types } from 'mongoose';

/**
 * Start/Create a Conversation (checks for existing private conversation).
 */
export const createConversation = catchAsync(async (req: Request, res: Response) => {
  const { participants, conversationType, courseId, organizationId } = req.body;
  const currentUserId = req.user?._id;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Compile all participants including current user
  const uniqueParticipantIds = Array.from(
    new Set([currentUserId.toString(), ...participants])
  ).map((id) => new Types.ObjectId(id));

  const type = conversationType || 'Private';

  // For one-on-one Private chats, prevent duplicates
  if (type === 'Private') {
    if (uniqueParticipantIds.length !== 2) {
      throw new ApiError(400, 'A private one-on-one conversation must have exactly 2 participants');
    }

    const existing = await Conversation.findOne({
      conversationType: 'Private',
      participants: { $all: uniqueParticipantIds, $size: 2 },
    }).populate('participants', 'firstName lastName email avatar role');

    if (existing) {
      return res.status(200).json(new ApiResponse(200, existing, 'Conversation retrieved successfully'));
    }
  }

  // Create new conversation
  const newConversation = await Conversation.create({
    participants: uniqueParticipantIds,
    conversationType: type,
    courseId,
    organizationId,
  });

  const populated = await newConversation.populate('participants', 'firstName lastName email avatar role');

  return res.status(201).json(new ApiResponse(201, populated, 'Conversation created successfully'));
});

/**
 * Retrieve current user's conversation list.
 */
export const getMyConversations = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { page = 1, limit = 20 } = req.query;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = { participants: currentUserId };

  const conversations = await Conversation.find(filter)
    .populate('participants', 'firstName lastName email avatar role')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'firstName lastName' },
    })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Conversation.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        conversations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Conversations retrieved successfully'
    )
  );
});

/**
 * Get single conversation metadata.
 */
export const getConversationDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?._id;

  const conversation = await Conversation.findById(id)
    .populate('participants', 'firstName lastName email avatar role')
    .populate('lastMessage');

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  // Ensure current user is a participant
  const isParticipant = conversation.participants.some(
    (p: any) => p._id.toString() === currentUserId?.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, 'You do not have access to this conversation');
  }

  res.status(200).json(new ApiResponse(200, conversation, 'Conversation retrieved successfully'));
});
export default createConversation;
