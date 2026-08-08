import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getTeacherEarningsDashboard,
  getTeacherTransactions,
  getTeacherTransactionById,
  getTeacherPayouts,
  requestTeacherPayout,
  getTeacherRevenueBreakdown,
  getTeacherFinancialReports,
  getTeacherRefunds,
} from './earnings.controller';

const router = Router();

router.get(
  ['/teacher/earnings/dashboard', '/teacher/earnings', '/earnings/dashboard', '/earnings'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherEarningsDashboard
);
router.get(
  ['/teacher/earnings/transactions', '/earnings/transactions'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherTransactions
);
router.get(
  ['/teacher/earnings/transactions/:id', '/earnings/transactions/:id'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherTransactionById
);
router.get(
  ['/teacher/earnings/payouts', '/earnings/payouts'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherPayouts
);
router.post(
  ['/teacher/earnings/payouts', '/earnings/payouts'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  requestTeacherPayout
);
router.get(
  ['/teacher/earnings/revenue', '/earnings/revenue'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherRevenueBreakdown
);
router.get(
  ['/teacher/earnings/reports', '/earnings/reports'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherFinancialReports
);
router.get(
  ['/teacher/earnings/refunds', '/earnings/refunds'],
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  getTeacherRefunds
);

export default router;
