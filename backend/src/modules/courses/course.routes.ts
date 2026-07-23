import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createCourseSchema, updateCourseSchema } from './course.validation';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  archiveCourse,
  duplicateCourse,
} from './course.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllCourses);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getCourseById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createCourseSchema }), createCourse);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateCourseSchema }), updateCourse);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteCourse);
router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishCourse);
router.patch('/:id/archive', validationMiddleware({ params: userIdSchema }), archiveCourse);
router.post('/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateCourse);

export default router;
