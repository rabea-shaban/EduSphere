import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllNotificationsAdmin,
  getNotificationByIdAdmin,
  sendBroadcastNotificationAdmin,
  deleteNotificationAdmin,
} from './notificationAdmin.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/notifications', getAllNotificationsAdmin);
router.post('/notifications/send', sendBroadcastNotificationAdmin);
router.get('/notifications/:id', getNotificationByIdAdmin);
router.delete('/notifications/:id', deleteNotificationAdmin);

export default router;
