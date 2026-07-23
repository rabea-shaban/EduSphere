import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createAssignmentSchema, updateAssignmentSchema } from './assignment.validation';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment,
  getAssignmentSubmissions,
} from './assignment.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllAssignments);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getAssignmentById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createAssignmentSchema }), createAssignment);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateAssignmentSchema }), updateAssignment);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteAssignment);
router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishAssignment);
router.patch('/:id/close', validationMiddleware({ params: userIdSchema }), closeAssignment);
router.get('/:id/submissions', validationMiddleware({ params: userIdSchema }), getAssignmentSubmissions);

export default router;
