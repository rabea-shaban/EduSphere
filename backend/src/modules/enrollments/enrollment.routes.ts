import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { enrollStudentSchema, updateEnrollmentSchema } from './enrollment.validation';
import {
  enrollStudent,
  cancelEnrollment,
  completeCourse,
  getMyCourses,
  getAllEnrollments,
} from './enrollment.controller';

const router = Router();

// Student-scoped routes
router.post('/enroll', protect, validationMiddleware({ body: enrollStudentSchema }), enrollStudent);
router.get('/my-courses', protect, getMyCourses);
router.patch('/:id/cancel', protect, validationMiddleware({ params: userIdSchema }), cancelEnrollment);

// Admin & Teacher-scoped routes
router.get('/', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getAllEnrollments);
router.patch(
  '/:id/complete',
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  validationMiddleware({ params: userIdSchema, body: updateEnrollmentSchema }),
  completeCourse
);

export default router;
