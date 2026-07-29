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

// ─── Teacher Earnings Endpoints (Supports both root & /teacher/earnings mounting) ──
router.get(['/dashboard', '/teacher/earnings/dashboard'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEarningsDashboard);
router.get(['/transactions', '/teacher/earnings/transactions'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherTransactions);
router.get(['/transactions/:id', '/teacher/earnings/transactions/:id'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherTransactionById);
router.get(['/payouts', '/teacher/earnings/payouts'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherPayouts);
router.post(['/payouts', '/teacher/earnings/payouts'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), requestTeacherPayout);
router.get(['/revenue', '/teacher/earnings/revenue'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueBreakdown);
router.get(['/reports', '/teacher/earnings/reports'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherFinancialReports);
router.get(['/refunds', '/teacher/earnings/refunds'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRefunds);

export default router;
