import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createInvoiceSchema } from './invoice.validation';
import { createInvoice, getAllInvoices, getInvoiceById } from './invoice.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllInvoices);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getInvoiceById);

// Write routes (admins only)
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  validationMiddleware({ body: createInvoiceSchema }),
  createInvoice
);

export default router;
