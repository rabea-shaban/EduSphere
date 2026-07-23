import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from './coupon.validation';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateAndApplyCoupon,
} from './coupon.controller';

const router = Router();

// Validate route (authenticated users)
router.post('/validate', protect, validationMiddleware({ body: validateCouponSchema }), validateAndApplyCoupon);

// Read routes (authenticated users)
router.get('/', protect, getAllCoupons);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getCouponById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createCouponSchema }), createCoupon);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateCouponSchema }), updateCoupon);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteCoupon);

export default router;
