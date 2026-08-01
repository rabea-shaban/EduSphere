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

// Protected Routes for all authenticated users (including STUDENTS for GET)
router.use(protect);

router.get('/', getTeacherAssignments);
router.get('/assignments', getTeacherAssignments);
router.get('/teacher/assignments', getTeacherAssignments);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getAssignmentById);
router.get('/assignments/:id', validationMiddleware({ params: userIdSchema }), getAssignmentById);
router.get('/teacher/assignments/:id', validationMiddleware({ params: userIdSchema }), getAssignmentById);

// Write / Modify Routes (Restricted to Teachers & Admins)
router.use(restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post(
  '/',
  validationMiddleware({ body: createAssignmentSchema }),
  createAssignment
);
router.post(
  '/assignments',
  validationMiddleware({ body: createAssignmentSchema }),
  createAssignment
);
router.post(
  '/teacher/assignments',
  validationMiddleware({ body: createAssignmentSchema }),
  createAssignment
);

router.put(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);
router.put(
  '/assignments/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);
router.patch(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);
router.patch(
  '/assignments/:id',
  validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }),
  updateAssignment
);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteAssignment);
router.delete('/assignments/:id', validationMiddleware({ params: userIdSchema }), deleteAssignment);

router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishAssignment);
router.patch('/assignments/:id/publish', validationMiddleware({ params: userIdSchema }), publishAssignment);

router.patch('/:id/unpublish', validationMiddleware({ params: userIdSchema }), unpublishAssignment);
router.patch('/assignments/:id/unpublish', validationMiddleware({ params: userIdSchema }), unpublishAssignment);

router.patch('/:id/archive', validationMiddleware({ params: userIdSchema }), archiveAssignment);
router.patch('/assignments/:id/archive', validationMiddleware({ params: userIdSchema }), archiveAssignment);

router.patch('/:id/restore', validationMiddleware({ params: userIdSchema }), restoreAssignment);
router.patch('/assignments/:id/restore', validationMiddleware({ params: userIdSchema }), restoreAssignment);

router.post('/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateAssignment);
router.post('/assignments/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateAssignment);

// Submissions & Analytics Sub-routes
router.get('/:id/submissions', validationMiddleware({ params: userIdSchema }), getAssignmentSubmissions);
router.get('/assignments/:id/submissions', validationMiddleware({ params: userIdSchema }), getAssignmentSubmissions);

router.get('/:id/analytics', validationMiddleware({ params: userIdSchema }), getAssignmentAnalytics);
router.get('/assignments/:id/analytics', validationMiddleware({ params: userIdSchema }), getAssignmentAnalytics);

export default router;
