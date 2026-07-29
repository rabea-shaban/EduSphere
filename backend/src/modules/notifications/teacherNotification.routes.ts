import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getTeacherNotifications,
  getTeacherNotificationById,
  markTeacherNotificationAsRead,
  markTeacherNotificationAsUnread,
  markAllTeacherNotificationsAsRead,
  deleteTeacherNotification,
  bulkDeleteTeacherNotifications,
  getTeacherNotificationPreferences,
  updateTeacherNotificationPreferences,
  getTeacherNotificationAnalytics,
} from './teacherNotification.controller';

const router = Router();

// ─── Teacher Notification Endpoints ──────────────────────────────────────────
router.get('/teacher/notifications', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotifications);
router.get('/notifications', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotifications);

router.get('/teacher/notifications/analytics', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationAnalytics);
router.get('/notifications/analytics', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationAnalytics);

router.get('/teacher/notifications/preferences', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationPreferences);
router.get('/notifications/preferences', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationPreferences);

router.put('/teacher/notifications/preferences', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherNotificationPreferences);
router.put('/notifications/preferences', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherNotificationPreferences);

router.patch('/teacher/notifications/read-all', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markAllTeacherNotificationsAsRead);
router.patch('/notifications/read-all', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markAllTeacherNotificationsAsRead);

router.delete('/teacher/notifications', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), bulkDeleteTeacherNotifications);
router.delete('/notifications', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), bulkDeleteTeacherNotifications);

router.get('/teacher/notifications/:id', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationById);
router.get('/notifications/:id', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationById);

router.patch('/teacher/notifications/:id/read', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsRead);
router.patch('/notifications/:id/read', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsRead);

router.patch('/teacher/notifications/:id/unread', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsUnread);
router.patch('/notifications/:id/unread', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsUnread);

router.delete('/teacher/notifications/:id', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherNotification);
router.delete('/notifications/:id', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherNotification);

export default router;
