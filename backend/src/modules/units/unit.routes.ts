import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createUnitSchema, updateUnitSchema } from './unit.validation';
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from './unit.controller';

const router = Router();

// Read routes (public - no auth required)
router.get('/', getAllUnits);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getUnitById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createUnitSchema }), createUnit);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateUnitSchema }), updateUnit);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteUnit);

export default router;
