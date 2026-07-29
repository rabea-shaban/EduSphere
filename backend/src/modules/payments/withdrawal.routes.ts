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

// ─── Teacher Wallet & Withdrawal Endpoints ─────────────────────────────────────
router.get(['/wallet', '/teacher/wallet'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWallet);
router.get(['/wallet/history', '/teacher/wallet/history'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWalletHistory);

router.get(['/withdrawals', '/teacher/withdrawals'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWithdrawals);
router.get(['/withdrawals/:id', '/teacher/withdrawals/:id'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherWithdrawalById);
router.post(['/withdrawals', '/teacher/withdrawals'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), createTeacherWithdrawal);
router.patch(['/withdrawals/:id/cancel', '/teacher/withdrawals/:id/cancel'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), cancelTeacherWithdrawal);

export default router;
