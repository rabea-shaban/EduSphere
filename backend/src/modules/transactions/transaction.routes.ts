import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { getAllTransactions, getTransactionById } from './transaction.controller';

const router = Router();

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllTransactions);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getTransactionById);

export default router;
