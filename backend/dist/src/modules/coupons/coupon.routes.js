"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const coupon_validation_1 = require("./coupon.validation");
const coupon_controller_1 = require("./coupon.controller");
const router = (0, express_1.Router)();
// Validate route (authenticated users)
router.post('/validate', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: coupon_validation_1.validateCouponSchema }), coupon_controller_1.validateAndApplyCoupon);
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, coupon_controller_1.getAllCoupons);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), coupon_controller_1.getCouponById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: coupon_validation_1.createCouponSchema }), coupon_controller_1.createCoupon);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: coupon_validation_1.updateCouponSchema }), coupon_controller_1.updateCoupon);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), coupon_controller_1.deleteCoupon);
exports.default = router;
