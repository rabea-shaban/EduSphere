import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createLessonSchema, updateLessonSchema } from './lesson.validation';
import {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} from './lesson.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllLessons);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getLessonById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createLessonSchema }), createLesson);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateLessonSchema }), updateLesson);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteLesson);

export default router;
