import { Request, Response } from 'express';
import { ActivityLog } from './activityLog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Utility function to write log entries to database.
 */
export const logEvent = async (
  userId: any,
  action: string,
  category: 'Login' | 'Course' | 'Payment' | 'Security' | 'Admin',
  details?: any,
  req?: Request
): Promise<void> => {
  try {
    await ActivityLog.create({
      userId,
      action,
      category,
      details,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    });
  } catch (error) {
    console.error('[ActivityLog] Failed to write event log:', error);
  }
};

/**
 * Create a new log entry manually (Admins only).
 */
export const createLog = catchAsync(async (req: Request, res: Response) => {
  const log = await ActivityLog.create(req.body);
  res.status(201).json(new ApiResponse(201, log, 'Activity log written successfully'));
});

/**
 * Retrieve all logs (Admins only).
 * Supports search, filters by category/user/date-range, and pagination.
 */
export const getAllLogs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, category, userId, startDate, endDate } = req.query;
  const filter: any = {};

  if (category) filter.category = category;
  if (userId) filter.userId = userId;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const logs = await ActivityLog.find(filter)
    .populate('userId', 'firstName lastName email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await ActivityLog.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Activity logs retrieved successfully'
    )
  );
});
export default getAllLogs;
