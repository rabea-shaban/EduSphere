"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const payment_validation_1 = require("./payment.validation");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Public Webhook route (Stripe callbacks)
router.post('/webhook', payment_controller_1.handleStripeWebhook);
// Student purchase routes
router.post('/purchase-course', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: payment_validation_1.purchaseCourseSchema }), payment_controller_1.purchaseCourse);
router.post('/purchase-subscription', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: payment_validation_1.purchaseSubscriptionSchema }), payment_controller_1.purchaseSubscription);
// Admin validation and lookup routes
router.post('/verify', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), (0, validationMiddleware_1.validationMiddleware)({ body: payment_validation_1.verifyPaymentSchema }), payment_controller_1.verifyPayment);
router.get('/', authMiddleware_1.protect, payment_controller_1.getAllPayments);
exports.default = router;
