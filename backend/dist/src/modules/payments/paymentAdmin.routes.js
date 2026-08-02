"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const paymentAdmin_controller_1 = require("./paymentAdmin.controller");
const router = (0, express_1.Router)();
// Protect all financial routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
// Payments Endpoints
router.get('/payments', paymentAdmin_controller_1.getAllPaymentsAdmin);
router.get('/payments/:id', paymentAdmin_controller_1.getPaymentByIdAdmin);
router.patch('/payments/:id/approve', paymentAdmin_controller_1.approvePaymentAdmin);
router.patch('/payments/:id/reject', paymentAdmin_controller_1.rejectPaymentAdmin);
router.patch('/payments/:id/refund', paymentAdmin_controller_1.refundPaymentAdmin);
// Withdrawals Endpoints
router.get('/withdrawals', paymentAdmin_controller_1.getAllWithdrawalsAdmin);
router.patch('/withdrawals/:id/approve', paymentAdmin_controller_1.approveWithdrawalAdmin);
router.patch('/withdrawals/:id/paid', paymentAdmin_controller_1.markWithdrawalPaidAdmin);
router.patch('/withdrawals/:id/reject', paymentAdmin_controller_1.rejectWithdrawalAdmin);
// Revenue Analytics Endpoint
router.get('/revenue', paymentAdmin_controller_1.getRevenueAnalyticsAdmin);
exports.default = router;
