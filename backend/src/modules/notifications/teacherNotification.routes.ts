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

router.use(protect);

// ─── Teacher Notification Endpoints ──────────────────────────────────────────
router.get('/teacher/notifications', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotifications);
router.get('/notifications', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotifications);

router.get('/teacher/notifications/analytics', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationAnalytics);
router.get('/notifications/analytics', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationAnalytics);

router.get('/teacher/notifications/preferences', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationPreferences);
router.get('/notifications/preferences', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationPreferences);

router.put('/teacher/notifications/preferences', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherNotificationPreferences);
router.put('/notifications/preferences', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherNotificationPreferences);

router.patch('/teacher/notifications/read-all', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markAllTeacherNotificationsAsRead);
router.patch('/notifications/read-all', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markAllTeacherNotificationsAsRead);

router.delete('/teacher/notifications', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), bulkDeleteTeacherNotifications);
router.delete('/notifications', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), bulkDeleteTeacherNotifications);

router.get('/teacher/notifications/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationById);
router.get('/notifications/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherNotificationById);

router.patch('/teacher/notifications/:id/read', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsRead);
router.patch('/notifications/:id/read', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsRead);

router.patch('/teacher/notifications/:id/unread', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsUnread);
router.patch('/notifications/:id/unread', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), markTeacherNotificationAsUnread);

router.delete('/teacher/notifications/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherNotification);
router.delete('/notifications/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherNotification);

export default router;
