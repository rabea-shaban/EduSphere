import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
  moveLessonSchema,
} from './lesson.validation';
import {
  getLessonsBySection,
  searchTeacherLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  archiveLesson,
  restoreLesson,
  duplicateLesson,
  reorderLessons,
  moveLesson,
  getAllLessons,
} from './lesson.controller';

const router = Router();

// ─── Public / Student read routes ─────────────────────────────────────────────
router.get('/', getAllLessons);

// ─── Protected Teacher / Admin routes ─────────────────────────────────────────
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

// Section-scoped lessons: GET & POST
router.get('/sections/:sectionId/lessons', getLessonsBySection);
router.post(
  '/sections/:sectionId/lessons',
  validationMiddleware({ body: createLessonSchema }),
  createLesson
);

// Global teacher lessons search
router.get('/teacher/lessons', searchTeacherLessons);

// Bulk reorder lessons (must come before /:id)
router.patch(
  '/reorder',
  validationMiddleware({ body: reorderLessonsSchema }),
  reorderLessons
);
router.patch(
  '/teacher/lessons/reorder',
  validationMiddleware({ body: reorderLessonsSchema }),
  reorderLessons
);

// Individual lesson routes
router.get('/:id', validationMiddleware({ params: userIdSchema }), getLessonById);
router.get('/teacher/lessons/:id', validationMiddleware({ params: userIdSchema }), getLessonById);

router.post(
  '/',
  validationMiddleware({ body: createLessonSchema }),
  createLesson
);

router.put(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateLessonSchema }),
  updateLesson
);
router.patch(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateLessonSchema }),
  updateLesson
);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteLesson);

router.patch('/:id/archive', validationMiddleware({ params: userIdSchema }), archiveLesson);
router.patch('/:id/restore', validationMiddleware({ params: userIdSchema }), restoreLesson);
router.post('/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateLesson);
router.patch(
  '/:id/move',
  validationMiddleware({ params: userIdSchema, body: moveLessonSchema }),
  moveLesson
);

export default router;
