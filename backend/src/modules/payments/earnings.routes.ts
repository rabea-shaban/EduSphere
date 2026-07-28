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

router.use(protect);

// ─── Teacher Earnings RESTful Endpoints ─────────────────────────────────────────
router.get('/teacher/earnings/dashboard', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEarningsDashboard);
router.get('/teacher/earnings/transactions', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherTransactions);
router.get('/teacher/earnings/transactions/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherTransactionById);
router.get('/teacher/earnings/payouts', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherPayouts);
router.post('/teacher/earnings/payouts', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), requestTeacherPayout);
router.get('/teacher/earnings/revenue', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueBreakdown);
router.get('/teacher/earnings/reports', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherFinancialReports);
router.get('/teacher/earnings/refunds', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRefunds);

export default router;
