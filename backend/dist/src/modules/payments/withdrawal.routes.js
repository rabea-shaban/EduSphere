"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const withdrawal_controller_1 = require("./withdrawal.controller");
const router = (0, express_1.Router)();
// ─── Teacher Wallet & Withdrawal Endpoints ─────────────────────────────────────
router.get(['/wallet', '/teacher/wallet'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.getTeacherWallet);
router.get(['/wallet/history', '/teacher/wallet/history'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.getTeacherWalletHistory);
router.get(['/withdrawals', '/teacher/withdrawals'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.getTeacherWithdrawals);
router.get(['/withdrawals/:id', '/teacher/withdrawals/:id'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.getTeacherWithdrawalById);
router.post(['/withdrawals', '/teacher/withdrawals'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.createTeacherWithdrawal);
router.patch(['/withdrawals/:id/cancel', '/teacher/withdrawals/:id/cancel'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), withdrawal_controller_1.cancelTeacherWithdrawal);
exports.default = router;
