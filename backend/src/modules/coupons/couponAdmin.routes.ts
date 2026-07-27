import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllCouponsAdmin,
  getCouponByIdAdmin,
  createCouponAdmin,
  updateCouponAdmin,
  activateCouponAdmin,
  deactivateCouponAdmin,
  softDeleteCouponAdmin,
  validateCouponCheckout,
} from './couponAdmin.controller';

const router = Router();

// Public Checkout Coupon Validation endpoint
router.post('/coupons/validate', validateCouponCheckout);

// Protected Admin Routes
router.use('/coupons', protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/coupons', getAllCouponsAdmin);
router.post('/coupons', createCouponAdmin);
router.get('/coupons/:id', getCouponByIdAdmin);
router.patch('/coupons/:id', updateCouponAdmin);
router.patch('/coupons/:id/activate', activateCouponAdmin);
router.patch('/coupons/:id/deactivate', deactivateCouponAdmin);
router.delete('/coupons/:id', softDeleteCouponAdmin);

export default router;
