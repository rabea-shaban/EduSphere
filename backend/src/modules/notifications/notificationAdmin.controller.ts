import { Request, Response } from 'express';
import { Notification } from './notification.model';
import { User } from '../users/user.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get all admin notifications with summary statistics, target audience, and filters.
 */
export const getAllNotificationsAdmin = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    priority,
  } = req.query;

  const filter: any = {};

  if (type && type !== 'All') {
    filter.type = type;
  }

  if (priority && priority !== 'All') {
    filter.priority = priority;
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { title: searchRegex },
      { message: searchRegex },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const rawNotifications = await Notification.find(filter)
    .populate('recipientId', 'firstName lastName email role avatar')
    .populate('senderId', 'firstName lastName email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Notification.countDocuments(filter);

  // Summary Metrics
  const totalNotifications = await Notification.countDocuments();
  const unreadCount = await Notification.countDocuments({ isRead: false });
  const readCount = await Notification.countDocuments({ isRead: true });

  const notifications = rawNotifications.map((n) => {
    const recipient: any = n.recipientId || {};
    const sender: any = n.senderId || {};

    return {
      _id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority || 'Medium',
      isRead: n.isRead,
      deliveryChannel: n.deliveryChannel || ['InApp'],
      createdAt: n.createdAt,
      recipient: {
        _id: recipient._id,
        fullName: `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.email || 'مستخدم',
        role: recipient.role,
        avatar: recipient.avatar,
      },
      sender: {
        _id: sender._id,
        fullName: `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || 'الإدارة',
      },
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalNotifications,
          sentCount: totalNotifications,
          unreadCount,
          readCount,
          readRate: totalNotifications > 0 ? `${Math.round((readCount / totalNotifications) * 100)}%` : '0%',
        },
        notifications,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Notifications retrieved successfully'
    )
  );
});

/**
 * Get notification details by ID.
 */
export const getNotificationByIdAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await Notification.findById(id)
    .populate('recipientId', 'firstName lastName email role phone avatar')
    .populate('senderId', 'firstName lastName email avatar');

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  res.status(200).json(new ApiResponse(200, notification, 'Notification details retrieved successfully'));
});

/**
 * Send / Broadcast Notification to Target Audience (All, Students, Teachers, Admins).
 */
export const sendBroadcastNotificationAdmin = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    message,
    type = 'Announcement',
    priority = 'High',
    targetAudience = 'ALL',
    deliveryChannel = ['InApp'],
  } = req.body;

  if (!title || !message) {
    throw new ApiError(400, 'عنوان ومحتوى الإشعار مطلوبة');
  }

  const senderId = (req as any).user?._id;

  // Resolve Recipient Users
  const userFilter: any = { isActive: { $ne: false } };
  if (targetAudience === 'STUDENTS') userFilter.role = 'STUDENT';
  if (targetAudience === 'TEACHERS') userFilter.role = 'TEACHER';
  if (targetAudience === 'ADMINS') userFilter.role = { $in: ['ADMIN', 'SUPER_ADMIN'] };

  const recipients = await User.find(userFilter).select('_id');

  if (recipients.length === 0) {
    throw new ApiError(400, 'لم يتم العثور على مستخدمين مطقين للفئة المستهدفة');
  }

  // Create notifications in batch
  const notificationDocs = recipients.map((r) => ({
    recipientId: r._id,
    senderId,
    title,
    message,
    type,
    priority,
    deliveryChannel,
    isRead: false,
  }));

  await Notification.insertMany(notificationDocs);

  // Trigger real-time Socket.io broadcast to online users
  recipients.forEach((r) => {
    emitToUser(r._id.toString(), 'notification', {
      title,
      message,
      type,
      priority,
      createdAt: new Date(),
    });
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { recipientsCount: recipients.length },
      `تم إرسال وبث الإشعار بنجاح لـ ${recipients.length} مستخدم 🎉`
    )
  );
});

/**
 * Delete notification.
 */
export const deleteNotificationAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (!notification) throw new ApiError(404, 'Notification not found');

  await Notification.deleteOne({ _id: id });
  res.status(200).json(new ApiResponse(200, null, 'تم حذف الإشعار بنجاح'));
});
