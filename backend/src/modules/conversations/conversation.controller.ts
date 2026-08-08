import { Request, Response } from 'express';
import { Conversation } from './conversation.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Course } from '../courses/course.model';
import User from '../users/user.model';
import Message from '../messages/message.model';
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

  // For one-on-one Private chats, prevent duplicates & enforce authorization
  if (type === 'Private') {
    if (uniqueParticipantIds.length !== 2) {
      throw new ApiError(400, 'A private one-on-one conversation must have exactly 2 participants');
    }

    const otherUserId = uniqueParticipantIds.find((id) => id.toString() !== currentUserId.toString());
    const currentUserRole = req.user?.role;

    if (otherUserId) {
      const targetUser = await User.findById(otherUserId);
      if (!targetUser || targetUser.isBlocked) {
        throw new ApiError(400, 'المستخدم غير متاح أو تم تقييده');
      }

      // Enforce Student-to-Student shared course requirement
      if (currentUserRole === 'STUDENT' && targetUser.role === 'STUDENT') {
        const myEnrollments = (await Enrollment.find({ studentId: currentUserId, status: 'Active' }).distinct('courseId')) as any[];
        const targetEnrollments = (await Enrollment.find({ studentId: otherUserId, status: 'Active' }).distinct('courseId')) as any[];
        const sharedCourses = myEnrollments.filter((cId: any) =>
          targetEnrollments.some((tId: any) => tId.toString() === cId.toString())
        );
        if (sharedCourses.length === 0) {
          throw new ApiError(403, 'يمكنك المراسلة فقط مع الطلاب المسجلين معك في نفس الكورس');
        }
      }
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

/**
 * Retrieve enrolled contacts (for Student: teachers of enrolled courses; for Teacher: students enrolled in their courses).
 */
export const getEnrolledContacts = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const userRole = req.user?.role;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  let contactUserIds: Types.ObjectId[] = [];

  if (userRole === 'STUDENT') {
    // 1. Find all active/completed enrollments for student
    const enrollments = await Enrollment.find({
      studentId: currentUserId,
      status: { $in: ['Active', 'Completed'] },
    }).select('teacherId courseId');

    const teacherIdsFromEnrollments = enrollments.map((e) => e.teacherId).filter(Boolean);

    // Also check courses where student is enrolled
    const courseIds = enrollments.map((e) => e.courseId).filter(Boolean);
    const courses = await Course.find({ _id: { $in: courseIds } }).select('teacher');
    const teacherIdsFromCourses = courses.map((c) => c.teacher).filter(Boolean);

    contactUserIds = Array.from(
      new Set([...teacherIdsFromEnrollments.map((id) => id.toString()), ...teacherIdsFromCourses.map((id) => id.toString())])
    ).map((id) => new Types.ObjectId(id));
  } else if (userRole === 'TEACHER' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    // 1. Find all courses taught by this teacher or enrollments
    const teacherCourses = await Course.find({ teacher: currentUserId }).select('_id');
    const courseIds = teacherCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      $or: [{ teacherId: currentUserId }, { courseId: { $in: courseIds } }],
      status: { $in: ['Active', 'Completed'] },
    }).select('studentId');

    contactUserIds = Array.from(
      new Set(enrollments.map((e) => e.studentId.toString()))
    ).map((id) => new Types.ObjectId(id));
  }

  // Fetch User objects for contacts
  const contacts = await User.find({ _id: { $in: contactUserIds } }).select('firstName lastName username email avatar role lastActiveAt');

  // Fetch existing conversations (Private and Group)
  const existingConversations = await Conversation.find({
    participants: currentUserId,
  })
    .populate('participants', 'firstName lastName email avatar role phone lastActiveAt')
    .populate('groupAdmin', 'firstName lastName email avatar role')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'firstName lastName' },
    })
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  // Ensure every enrolled contact has a conversation object created or matched
  const contactConversations = await Promise.all(
    contacts.map(async (contact) => {
      let conv = existingConversations.find((c) =>
        c.participants.some((p: any) => p._id.toString() === contact._id.toString())
      );

      if (!conv) {
        conv = await Conversation.create({
          participants: [currentUserId, contact._id],
          conversationType: 'Private',
        });
        conv = await conv.populate('participants', 'firstName lastName email avatar role lastActiveAt');
      }
      return conv;
    })
  );

  // Deduplicate conversations by _id
  const allConvList = [...existingConversations, ...contactConversations];
  const uniqueConvMap = new Map<string, any>();
  allConvList.forEach((conv) => {
    if (conv && conv._id) {
      uniqueConvMap.set(conv._id.toString(), conv);
    }
  });
  const uniqueConversations = Array.from(uniqueConvMap.values());

  res.status(200).json(
    new ApiResponse(
      200,
      {
        contacts,
        conversations: uniqueConversations,
      },
      'Enrolled contacts and conversations retrieved successfully'
    )
  );
});

/**
 * Search users on platform by name, phone, email, or username to initiate chat.
 */
export const searchUsersForChat = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { q } = req.query;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    res.status(200).json(new ApiResponse(200, { users: [] }, 'Search query empty'));
    return;
  }

  const queryRegex = new RegExp(q.trim(), 'i');

  const users = await User.find({
    _id: { $ne: currentUserId },
    isBlocked: false,
    $or: [
      { firstName: queryRegex },
      { lastName: queryRegex },
      { username: queryRegex },
      { phone: queryRegex },
      { email: queryRegex },
    ],
  })
    .select('firstName lastName username phone email avatar role')
    .limit(20)
    .lean();

  res.status(200).json(new ApiResponse(200, { users }, 'Users search results'));
});

/**
 * Create a new Group conversation.
 */
export const createGroupConversation = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { title, participants, description, groupAvatar } = req.body;

  if (!currentUserId) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new ApiError(400, 'Group title is required');
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, 'At least one participant is required to create a group');
  }

  // Deduplicate participants and include current user
  const allParticipantIds = Array.from(
    new Set([currentUserId.toString(), ...participants.map((p: any) => p.toString())])
  );

  let groupConv = await Conversation.create({
    groupTitle: title.trim(),
    description: description ? description.trim() : '',
    groupAvatar: groupAvatar || '',
    participants: allParticipantIds,
    conversationType: 'Group',
    groupAdmin: currentUserId,
    lastMessageAt: new Date(),
  });

  groupConv = await groupConv.populate('participants', 'firstName lastName email avatar role phone');
  groupConv = await groupConv.populate('groupAdmin', 'firstName lastName email avatar role');

  res.status(201).json(new ApiResponse(201, groupConv, 'Group conversation created successfully'));
});

/**
 * Leave a Group conversation.
 */
export const leaveGroupConversation = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const conversationId = req.params.id as string;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  if (conversation.conversationType !== 'Group') {
    throw new ApiError(400, 'Not a group conversation');
  }

  // Remove current user from participants
  conversation.participants = conversation.participants.filter(
    (p) => p.toString() !== currentUserId.toString()
  );

  // If admin left and members remain, reassign admin
  if (
    conversation.groupAdmin &&
    conversation.groupAdmin.toString() === currentUserId.toString() &&
    conversation.participants.length > 0
  ) {
    conversation.groupAdmin = conversation.participants[0];
  }

  await conversation.save();

  res.status(200).json(new ApiResponse(200, null, 'Left group successfully'));
});

/**
 * Delete a Group conversation (Admin only).
 */
export const deleteGroupConversation = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const conversationId = req.params.id as string;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  if (conversation.conversationType !== 'Group') {
    throw new ApiError(400, 'Not a group conversation');
  }

  const isAdmin =
    conversation.groupAdmin?.toString() === currentUserId.toString() ||
    req.user?.role === 'ADMIN' ||
    req.user?.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    throw new ApiError(403, 'Only group admin can delete the group');
  }

  // Delete all messages in conversation
  await Message.deleteMany({ conversationId });

  // Delete conversation
  await Conversation.findByIdAndDelete(conversationId);

  res.status(200).json(new ApiResponse(200, null, 'Group deleted successfully'));
});

/**
 * Clear chat history for current user.
 */
export const clearConversationMessages = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const conversationId = req.params.id as string;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  // Mark all messages in this conversation as deleted for current user
  await Message.updateMany(
    { conversationId },
    { $addToSet: { deletedFor: currentUserId } }
  );

  res.status(200).json(new ApiResponse(200, null, 'Chat history cleared successfully'));
});

// Import CallSignal for WebRTC persistence
import { CallSignal } from './callSignal.model';
import { emitToUser } from '../../config/socket';

/**
 * Initiate a call signal (Voice or Video)
 */
export const initiateCallSignal = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { targetUserId, conversationId, offer, callerName, callerAvatar, callType } = req.body;

  if (!currentUserId || !targetUserId) {
    throw new ApiError(400, 'Missing required fields');
  }

  // Clear any existing active signals between these users
  await CallSignal.deleteMany({
    $or: [
      { callerId: currentUserId, targetUserId },
      { callerId: targetUserId, targetUserId: currentUserId },
    ],
  });

  const signal = await CallSignal.create({
    callerId: currentUserId,
    targetUserId,
    conversationId,
    callerName: callerName || 'مستخدم المنصة',
    callerAvatar,
    callType: callType || 'voice',
    offer,
    status: 'outgoing',
  });

  // Emit socket event if connected
  emitToUser(targetUserId.toString(), 'incoming-call', {
    from: currentUserId.toString(),
    offer,
    conversationId,
    callerName,
    callerAvatar,
    callType,
    callId: signal._id,
  });

  res.status(200).json(new ApiResponse(200, signal, 'Call signal initiated'));
});

/**
 * Poll active call signal and update user heartbeat
 */
export const pollCallSignal = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  if (!currentUserId) throw new ApiError(401, 'Unauthorized');

  // Update user active timestamp
  await User.findByIdAndUpdate(currentUserId, { lastActiveAt: new Date() });

  const signal = await CallSignal.findOne({
    $or: [
      { targetUserId: currentUserId, status: { $in: ['outgoing', 'incoming', 'connected'] } },
      { callerId: currentUserId, status: { $in: ['outgoing', 'connected', 'rejected', 'ended'] } },
    ],
  }).sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, signal || null, 'Call signal polled'));
});

/**
 * Respond to call signal (accept, reject, end, candidate)
 */
export const respondCallSignal = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { callId, action, answer, candidate } = req.body;

  if (!currentUserId || !callId || !action) {
    throw new ApiError(400, 'Missing parameters');
  }

  const signal = await CallSignal.findById(callId);
  if (!signal) {
    res.status(200).json(new ApiResponse(200, null, 'Call signal not found'));
    return;
  }

  if (action === 'accept' && answer) {
    signal.answer = answer;
    signal.status = 'connected';
    signal.connectedAt = new Date();
    await signal.save();

    emitToUser(signal.callerId.toString(), 'call-answered', {
      from: currentUserId.toString(),
      answer,
    });
  } else if (action === 'reject') {
    signal.status = 'rejected';
    await signal.save();

    emitToUser(signal.callerId.toString(), 'call-rejected', { from: currentUserId.toString() });
  } else if (action === 'end') {
    signal.status = 'ended';
    await signal.save();

    const otherUserId =
      signal.callerId.toString() === currentUserId.toString()
        ? signal.targetUserId.toString()
        : signal.callerId.toString();

    emitToUser(otherUserId, 'call-ended', { from: currentUserId.toString() });
  } else if (action === 'candidate' && candidate) {
    if (signal.callerId.toString() === currentUserId.toString()) {
      signal.callerCandidates = signal.callerCandidates || [];
      signal.callerCandidates.push(candidate);
    } else {
      signal.targetCandidates = signal.targetCandidates || [];
      signal.targetCandidates.push(candidate);
    }
    await signal.save();

    const recipient =
      signal.callerId.toString() === currentUserId.toString()
        ? signal.targetUserId.toString()
        : signal.callerId.toString();

    emitToUser(recipient, 'ice-candidate', {
      from: currentUserId.toString(),
      candidate,
    });
  }

  res.status(200).json(new ApiResponse(200, signal, 'Call signal updated'));
});

/**
 * Presence Heartbeat
 */
export const heartbeat = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  if (currentUserId) {
    await User.findByIdAndUpdate(currentUserId, { lastActiveAt: new Date() });
  }
  res.status(200).json(new ApiResponse(200, { online: true }, 'Heartbeat recorded'));
});

/**
 * Get users that current user can initiate a new chat with (enforces role rules and shared courses)
 */
export const getAssignableUsers = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const currentUserRole = req.user?.role;
  const { search = '', role } = req.query;

  if (!currentUserId) throw new ApiError(401, 'Unauthorized');

  const query: any = {
    _id: { $ne: currentUserId },
    isBlocked: { $ne: true },
  };

  if (role && ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'].includes(String(role).toUpperCase())) {
    query.role = String(role).toUpperCase();
  }

  if (search) {
    const searchRegex = new RegExp(String(search).trim(), 'i');
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { username: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  let users = await User.find(query)
    .select('firstName lastName username email avatar role')
    .limit(40)
    .lean();

  // For Student user, filter out other students who do NOT share any active course enrollment
  if (currentUserRole === 'STUDENT') {
    const myCourseIds = (await Enrollment.find({ studentId: currentUserId, status: 'Active' }).distinct('courseId')) as any[];
    const myCourseStrings = new Set(myCourseIds.map((id: any) => id.toString()));

    const validUsers = [];
    for (const u of users) {
      if (u.role !== 'STUDENT') {
        validUsers.push(u);
      } else {
        const studentCourses = (await Enrollment.find({ studentId: u._id, status: 'Active' }).distinct('courseId')) as any[];
        const hasShared = studentCourses.some((cId: any) => myCourseStrings.has(cId.toString()));
        if (hasShared) {
          validUsers.push(u);
        }
      }
    }
    users = validUsers;
  }

  return res.status(200).json(new ApiResponse(200, users, 'Assignable users retrieved successfully'));
});

/**
 * Search user conversations
 */
export const searchConversations = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { q = '' } = req.query;

  if (!currentUserId) throw new ApiError(401, 'Unauthorized');
  if (!q) {
    return res.status(200).json(new ApiResponse(200, [], 'Empty query'));
  }

  const searchRegex = new RegExp(String(q).trim(), 'i');

  const conversations = await Conversation.find({
    participants: currentUserId,
  })
    .populate('participants', 'firstName lastName email avatar role')
    .populate('lastMessage')
    .lean();

  const filtered = conversations.filter((conv) => {
    if (conv.groupTitle && searchRegex.test(conv.groupTitle)) return true;
    return conv.participants.some(
      (p: any) =>
        p._id.toString() !== currentUserId.toString() &&
        (searchRegex.test(p.firstName) || searchRegex.test(p.lastName) || searchRegex.test(p.username))
    );
  });

  return res.status(200).json(new ApiResponse(200, filtered, 'Conversations search results'));
});

export default createConversation;
