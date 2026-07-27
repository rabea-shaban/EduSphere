import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllPaymentsAdmin,
  getPaymentByIdAdmin,
  approvePaymentAdmin,
  rejectPaymentAdmin,
  refundPaymentAdmin,
  getAllWithdrawalsAdmin,
  approveWithdrawalAdmin,
  markWithdrawalPaidAdmin,
  rejectWithdrawalAdmin,
  getRevenueAnalyticsAdmin,
} from './paymentAdmin.controller';

const router = Router();

// Protect all financial routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

// Payments Endpoints
router.get('/payments', getAllPaymentsAdmin);
router.get('/payments/:id', getPaymentByIdAdmin);
router.patch('/payments/:id/approve', approvePaymentAdmin);
router.patch('/payments/:id/reject', rejectPaymentAdmin);
router.patch('/payments/:id/refund', refundPaymentAdmin);

// Withdrawals Endpoints
router.get('/withdrawals', getAllWithdrawalsAdmin);
router.patch('/withdrawals/:id/approve', approveWithdrawalAdmin);
router.patch('/withdrawals/:id/paid', markWithdrawalPaidAdmin);
router.patch('/withdrawals/:id/reject', rejectWithdrawalAdmin);

// Revenue Analytics Endpoint
router.get('/revenue', getRevenueAnalyticsAdmin);

export default router;
