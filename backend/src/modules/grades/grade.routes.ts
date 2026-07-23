import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createGradeSchema, updateGradeSchema } from './grade.validation';
import {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  activateGrade,
  deactivateGrade,
} from './grade.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllGrades);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getGradeById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createGradeSchema }), createGrade);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateGradeSchema }), updateGrade);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteGrade);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateGrade);
router.patch('/:id/deactivate', validationMiddleware({ params: userIdSchema }), deactivateGrade);

export default router;
