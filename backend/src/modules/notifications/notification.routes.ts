import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createNotificationSchema } from './notification.validation';
import {
  createNotification,
  markAsRead,
  markAllAsRead,
  getMyNotifications,
  deleteNotification,
} from './notification.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getMyNotifications);
router.patch('/mark-all-read', protect, markAllAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, validationMiddleware({ params: userIdSchema }), markAsRead);
router.delete('/:id', protect, validationMiddleware({ params: userIdSchema }), deleteNotification);

// Write routes (admins and teachers only)
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  validationMiddleware({ body: createNotificationSchema }),
  createNotification
);

export default router;
