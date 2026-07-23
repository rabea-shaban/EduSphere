import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createTermSchema, updateTermSchema } from './term.validation';
import {
  createTerm,
  getAllTerms,
  getTermById,
  updateTerm,
  deleteTerm,
  activateTerm,
  deactivateTerm,
} from './term.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllTerms);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getTermById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createTermSchema }), createTerm);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateTermSchema }), updateTerm);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteTerm);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateTerm);
router.patch('/:id/deactivate', validationMiddleware({ params: userIdSchema }), deactivateTerm);

export default router;
