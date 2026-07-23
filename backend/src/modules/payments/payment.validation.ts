import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for purchasing a Course.
 */
export const purchaseCourseSchema = Joi.object({
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  couponCode: Joi.string().trim().uppercase().optional(),
});

/**
 * Joi validation schema for purchasing a Subscription.
 */
export const purchaseSubscriptionSchema = Joi.object({
  subscriptionId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid subscription plan ID format',
    'any.required': 'Subscription plan ID is required',
  }),
  couponCode: Joi.string().trim().uppercase().optional(),
});

/**
 * Joi validation schema for verifying manual payments (admins only).
 */
export const verifyPaymentSchema = Joi.object({
  paymentId: Joi.string().pattern(mongoIdPattern).required(),
  status: Joi.string().valid('Paid', 'Failed').required(),
  paymentReference: Joi.string().trim().required(),
  paidAt: Joi.date().iso().optional(),
});
