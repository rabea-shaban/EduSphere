import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import {
  purchaseCourseSchema,
  purchaseSubscriptionSchema,
  verifyPaymentSchema,
} from './payment.validation';
import {
  purchaseCourse,
  purchaseSubscription,
  verifyPayment,
  handleStripeWebhook,
  getAllPayments,
} from './payment.controller';

const router = Router();

// Public Webhook route (Stripe callbacks)
router.post('/webhook', handleStripeWebhook);

// Student purchase routes
router.post('/purchase-course', protect, validationMiddleware({ body: purchaseCourseSchema }), purchaseCourse);
router.post('/purchase-subscription', protect, validationMiddleware({ body: purchaseSubscriptionSchema }), purchaseSubscription);

// Admin validation and lookup routes
router.post('/verify', protect, restrictTo('SUPER_ADMIN', 'ADMIN'), validationMiddleware({ body: verifyPaymentSchema }), verifyPayment);
router.get('/', protect, getAllPayments);

export default router;
