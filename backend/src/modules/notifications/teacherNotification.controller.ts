import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { Types } from 'mongoose';
import NotificationManagementService from './services/notificationManagement.service';
import NotificationPreferencesService from './services/notificationPreferences.service';
import NotificationAnalyticsService from './services/notificationAnalytics.service';

async function logActivity(userId: string, userName: string, userRole: string, action: string, details?: object): Promise<void> {
  await ActivityLog.create({
    userId: new Types.ObjectId(userId) as any,
    userName,
    userRole,
    action,
    category: 'Admin',
    module: 'Notifications',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

/**
 * GET /teacher/notifications
 */
export const getTeacherNotifications = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { page = 1, limit = 20, isRead, type, search } = req.query;

  const isReadBool = isRead === 'true' ? true : isRead === 'false' ? false : undefined;

  const result = await NotificationManagementService.getNotifications(
    userId,
    Number(page),
    Number(limit),
    isReadBool,
    type as string,
    search as string
  );

  await logActivity(userId, userName, userRole, 'NOTIFICATION_VIEWED');

  res.status(200).json(new ApiResponse(200, result, 'Teacher notifications retrieved successfully'));
});

/**
 * GET /teacher/notifications/:id
 */
export const getTeacherNotificationById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();

  const notification = await NotificationManagementService.getNotificationById(String(id), userId);

  res.status(200).json(new ApiResponse(200, notification, 'Notification details retrieved successfully'));
});

/**
 * PATCH /teacher/notifications/:id/read
 */
export const markTeacherNotificationAsRead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const notification = await NotificationManagementService.toggleRead(String(id), userId, true);

  await logActivity(userId, userName, userRole, 'NOTIFICATION_READ', { notificationId: id });

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

/**
 * PATCH /teacher/notifications/:id/unread
 */
export const markTeacherNotificationAsUnread = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();

  const notification = await NotificationManagementService.toggleRead(String(id), userId, false);

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as unread'));
});

/**
 * PATCH /teacher/notifications/read-all
 */
export const markAllTeacherNotificationsAsRead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  await NotificationManagementService.markAllAsRead(userId);

  await logActivity(userId, userName, userRole, 'NOTIFICATION_ALL_READ');

  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

/**
 * DELETE /teacher/notifications/:id
 */
export const deleteTeacherNotification = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  await NotificationManagementService.deleteNotification(String(id), userId);

  await logActivity(userId, userName, userRole, 'NOTIFICATION_DELETED', { notificationId: id });

  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

/**
 * DELETE /teacher/notifications
 */
export const bulkDeleteTeacherNotifications = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const { notificationIds, clearReadOnly } = req.body;

  await NotificationManagementService.bulkDelete(userId, notificationIds, clearReadOnly);

  res.status(200).json(new ApiResponse(200, null, 'Notifications cleared successfully'));
});

/**
 * GET /teacher/notifications/preferences
 */
export const getTeacherNotificationPreferences = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const preferences = await NotificationPreferencesService.getPreferences(userId);

  res.status(200).json(new ApiResponse(200, preferences, 'Notification preferences retrieved successfully'));
});

/**
 * PUT /teacher/notifications/preferences
 */
export const updateTeacherNotificationPreferences = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const preferences = await NotificationPreferencesService.updatePreferences(userId, req.body);

  await logActivity(userId, userName, userRole, 'PREFERENCES_UPDATED');

  res.status(200).json(new ApiResponse(200, preferences, 'تم تحديث تفضيلات الإشعارات بنجاح'));
});

/**
 * GET /teacher/notifications/analytics
 */
export const getTeacherNotificationAnalytics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();

  const analytics = await NotificationAnalyticsService.getTeacherNotificationAnalytics(userId);

  res.status(200).json(new ApiResponse(200, analytics, 'Notification analytics retrieved successfully'));
});
