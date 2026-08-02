"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const subscription_validation_1 = require("./subscription.validation");
const subscription_controller_1 = require("./subscription.controller");
const router = (0, express_1.Router)();
// Read routes (public access for landing page & students)
router.get('/', subscription_controller_1.getAllPlans);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subscription_controller_1.getPlanById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: subscription_validation_1.createSubscriptionPlanSchema }), subscription_controller_1.createPlan);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: subscription_validation_1.updateSubscriptionPlanSchema }), subscription_controller_1.updatePlan);
router.patch('/:id/activate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subscription_controller_1.activatePlan);
router.patch('/:id/deactivate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subscription_controller_1.deactivatePlan);
exports.default = router;
