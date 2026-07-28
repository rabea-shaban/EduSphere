import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getTeacherWallet,
  getTeacherWalletHistory,
  getTeacherWithdrawals,
  getTeacherWithdrawalById,
  createTeacherWithdrawal,
  cancelTeacherWithdrawal,
} from './withdrawal.controller';

const router = Router();

router.use(protect);

// ─── Teacher Wallet Endpoints ──────────────────────────────────────────────────
router.get('/teacher/wallet', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWallet);
router.get('/teacher/wallet/history', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWalletHistory);

// ─── Teacher Withdrawal Endpoints ──────────────────────────────────────────────
router.get('/teacher/withdrawals', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWithdrawals);
router.get('/teacher/withdrawals/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWithdrawalById);
router.post('/teacher/withdrawals', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), createTeacherWithdrawal);
router.patch('/teacher/withdrawals/:id/cancel', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), cancelTeacherWithdrawal);

export default router;
