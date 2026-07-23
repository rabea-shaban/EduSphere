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
} from './notification.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getMyNotifications);
router.patch('/mark-all-read', protect, markAllAsRead);
router.patch('/:id/read', protect, validationMiddleware({ params: userIdSchema }), markAsRead);

// Write routes (admins and teachers only)
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  validationMiddleware({ body: createNotificationSchema }),
  createNotification
);

export default router;
