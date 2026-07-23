import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createSubjectSchema, updateSubjectSchema } from './subject.validation';
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  activateSubject,
  deactivateSubject,
} from './subject.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllSubjects);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getSubjectById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createSubjectSchema }), createSubject);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateSubjectSchema }), updateSubject);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteSubject);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateSubject);
router.patch('/:id/deactivate', validationMiddleware({ params: userIdSchema }), deactivateSubject);

export default router;
