"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const couponAdmin_controller_1 = require("./couponAdmin.controller");
const router = (0, express_1.Router)();
// Public Checkout Coupon Validation endpoint
router.post('/coupons/validate', couponAdmin_controller_1.validateCouponCheckout);
// Protected Admin Routes
router.use('/coupons', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/coupons', couponAdmin_controller_1.getAllCouponsAdmin);
router.post('/coupons', couponAdmin_controller_1.createCouponAdmin);
router.get('/coupons/:id', couponAdmin_controller_1.getCouponByIdAdmin);
router.patch('/coupons/:id', couponAdmin_controller_1.updateCouponAdmin);
router.patch('/coupons/:id/activate', couponAdmin_controller_1.activateCouponAdmin);
router.patch('/coupons/:id/deactivate', couponAdmin_controller_1.deactivateCouponAdmin);
router.delete('/coupons/:id', couponAdmin_controller_1.softDeleteCouponAdmin);
exports.default = router;
