import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createSubscriptionPlanSchema, updateSubscriptionPlanSchema } from './subscription.validation';
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  activatePlan,
  deactivatePlan,
} from './subscription.controller';

const router = Router();

// Read routes (public access for landing page & students)
router.get('/', getAllPlans);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getPlanById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createSubscriptionPlanSchema }), createPlan);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateSubscriptionPlanSchema }), updatePlan);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activatePlan);
router.patch('/:id/deactivate', validationMiddleware({ params: userIdSchema }), deactivatePlan);

export default router;
