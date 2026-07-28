import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from './assignment.validation';
import {
  getTeacherAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  unpublishAssignment,
  archiveAssignment,
  restoreAssignment,
  duplicateAssignment,
  getAssignmentSubmissions,
  getAssignmentAnalytics,
} from './assignment.controller';

const router = Router();

// Protected Teacher & Admin Routes
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.get('/', getTeacherAssignments);
router.get('/teacher/assignments', getTeacherAssignments);

router.post(
  '/',
  validationMiddleware({ body: createAssignmentSchema }),
  createAssignment
);
router.post(
  '/teacher/assignments',
  validationMiddleware({ body: createAssignmentSchema }),
  createAssignment
);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getAssignmentById);
router.get('/teacher/assignments/:id', validationMiddleware({ params: userIdSchema }), getAssignmentById);

router.put(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);
router.patch(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteAssignment);

router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishAssignment);
router.patch('/:id/unpublish', validationMiddleware({ params: userIdSchema }), unpublishAssignment);
router.patch('/:id/archive', validationMiddleware({ params: userIdSchema }), archiveAssignment);
router.patch('/:id/restore', validationMiddleware({ params: userIdSchema }), restoreAssignment);
router.post('/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateAssignment);

// Submissions & Analytics Sub-routes
router.get('/:id/submissions', validationMiddleware({ params: userIdSchema }), getAssignmentSubmissions);
router.get('/:id/analytics', validationMiddleware({ params: userIdSchema }), getAssignmentAnalytics);

export default router;
