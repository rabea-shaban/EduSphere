import { Request, Response } from 'express';
import { Notification } from './notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new notification and push it in real-time.
 */
export const createNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.create(req.body);

  // Emit to Socket.io recipient room
  emitToUser(notification.recipientId, 'notification', notification);

  res.status(201).json(new ApiResponse(201, notification, 'Notification dispatched successfully'));
});

/**
 * Mark a specific notification as read.
 */
export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?._id;

  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  // Ensure owner is modifying
  if (studentId && notification.recipientId.toString() !== studentId.toString()) {
    throw new ApiError(403, 'Unauthorized');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

/**
 * Mark all notifications for the current user as read.
 */
export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const recipientId = req.user?._id;
  if (!recipientId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const now = new Date();
  await Notification.updateMany(
    { recipientId, isRead: false },
    { $set: { isRead: true, readAt: now } }
  );

  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

/**
 * Delete a specific notification.
 */
export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?._id;

  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  // Ensure owner is deleting
  if (studentId && notification.recipientId.toString() !== studentId.toString()) {
    throw new ApiError(403, 'Unauthorized');
  }

  await notification.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

/**
 * Retrieve notifications of the logged in user with filters, search, and pagination.
 */
export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const recipientId = req.user?._id;
  const { page = 1, limit = 20, isRead, type, search } = req.query;

  if (!recipientId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const filter: any = { recipientId };
  if (isRead !== undefined && isRead !== '') {
    filter.isRead = isRead === 'true';
  }
  if (type && type !== 'all') {
    filter.type = type;
  }
  if (search) {
    filter.$or = [
      { title: new RegExp(search as string, 'i') },
      { message: new RegExp(search as string, 'i') },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const notifications = await Notification.find(filter)
    .populate('senderId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        unreadCount,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Notifications history retrieved successfully'
    )
  );
});

export default createNotification;
