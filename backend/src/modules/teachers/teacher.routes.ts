import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  getAllTeachers,
  getTeacherById,
  getTeacherCourses,
  getTeacherRevenue,
  updateTeacher,
  suspendTeacher,
  activateTeacher,
  resetTeacherPassword,
  softDeleteTeacher,
  sendTeacherNotification,
} from './teacher.controller';

const router = Router();

// Protect all routes to Super Admin & Admin only
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllTeachers);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getTeacherById);
router.patch('/:id', validationMiddleware({ params: userIdSchema }), updateTeacher);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), softDeleteTeacher);

router.get('/:id/courses', validationMiddleware({ params: userIdSchema }), getTeacherCourses);
router.get('/:id/revenue', validationMiddleware({ params: userIdSchema }), getTeacherRevenue);

router.patch('/:id/suspend', validationMiddleware({ params: userIdSchema }), suspendTeacher);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateTeacher);
router.patch('/:id/reset-password', validationMiddleware({ params: userIdSchema }), resetTeacherPassword);
router.post('/:id/notify', validationMiddleware({ params: userIdSchema }), sendTeacherNotification);

export default router;
