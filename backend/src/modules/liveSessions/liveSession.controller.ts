import { Request, Response } from 'express';
import { LiveSession } from './liveSession.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Schedule a new live session.
 */
export const scheduleLiveSession = catchAsync(async (req: Request, res: Response) => {
  const sessionData = { ...req.body };
  if (!sessionData.teacherId && req.user) {
    sessionData.teacherId = req.user._id;
  }

  const session = await LiveSession.create(sessionData);
  res.status(201).json(new ApiResponse(201, session, 'Live Session scheduled successfully'));
});

/**
 * Get all live sessions with query filters.
 */
export const getAllLiveSessions = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, courseId, status } = req.query;
  const filter: any = {};

  if (courseId) filter.courseId = courseId;
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const sessions = await LiveSession.find(filter)
    .populate('courseId', 'title slug')
    .populate('teacherId', 'firstName lastName avatar email')
    .sort({ startTime: 1 })
    .skip(skip)
    .limit(limitNum);

  const total = await LiveSession.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        sessions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Live sessions retrieved successfully'
    )
  );
});

/**
 * Get Live Session by ID.
 */
export const getLiveSessionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await LiveSession.findById(id)
    .populate('courseId', 'title slug')
    .populate('teacherId', 'firstName lastName avatar email');

  if (!session) {
    throw new ApiError(404, 'Live Session not found');
  }

  res.status(200).json(new ApiResponse(200, session, 'Live Session retrieved successfully'));
});

/**
 * Update Live Session details.
 */
export const updateLiveSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await LiveSession.findById(id);

  if (!session) {
    throw new ApiError(404, 'Live Session not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && session.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this session');
  }

  Object.assign(session, req.body);
  await session.save();

  res.status(200).json(new ApiResponse(200, session, 'Live Session updated successfully'));
});

/**
 * Cancel Scheduled Live Session.
 */
export const cancelLiveSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await LiveSession.findById(id);

  if (!session) {
    throw new ApiError(404, 'Live Session not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && session.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to cancel this session');
  }

  session.status = 'Cancelled';
  await session.save();

  res.status(200).json(new ApiResponse(200, session, 'Live Session cancelled successfully'));
});

/**
 * Join live session (Returns meeting Link).
 */
export const joinLiveSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await LiveSession.findById(id);

  if (!session) {
    throw new ApiError(404, 'Live Session not found');
  }

  if (session.status === 'Cancelled') {
    throw new ApiError(400, 'Cannot join. This live session is cancelled.');
  }

  // Update status to Live if the teacher joins and status is Scheduled
  if (req.user && req.user.role === 'TEACHER' && session.teacherId.toString() === req.user._id.toString() && session.status === 'Scheduled') {
    session.status = 'Live';
    await session.save();
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        meetingLink: session.meetingLink,
        status: session.status,
      },
      'Meeting details retrieved successfully'
    )
  );
});

/**
 * Save recorded video link and set session to completed.
 */
export const saveRecordingLink = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { recordingUrl } = req.body;

  const session = await LiveSession.findById(id);
  if (!session) {
    throw new ApiError(404, 'Live Session not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && session.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this session');
  }

  session.recordingUrl = recordingUrl;
  session.status = 'Completed';
  await session.save();

  res.status(200).json(new ApiResponse(200, session, 'Recording saved and session marked as completed'));
});
export default scheduleLiveSession;
