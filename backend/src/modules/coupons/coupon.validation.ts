import Joi from 'joi';

/**
 * Joi validation schema for creating a Coupon.
 */
export const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().required().messages({
    'string.empty': 'Coupon code is required',
  }),
  description: Joi.string().trim().optional(),
  discountType: Joi.string().valid('Percentage', 'Fixed').required(),
  discountValue: Joi.number().min(0).required(),
  maximumDiscount: Joi.number().min(0).optional(),
  minimumPurchase: Joi.number().min(0).optional().default(0),
  usageLimit: Joi.number().integer().min(1).optional(),
  expiresAt: Joi.date().iso().required(),
  status: Joi.string().valid('Active', 'Inactive').optional(),
});

/**
 * Joi validation schema for updating an existing Coupon.
 */
export const updateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().optional(),
  description: Joi.string().trim().optional(),
  discountType: Joi.string().valid('Percentage', 'Fixed').optional(),
  discountValue: Joi.number().min(0).optional(),
  maximumDiscount: Joi.number().min(0).optional(),
  minimumPurchase: Joi.number().min(0).optional(),
  usageLimit: Joi.number().integer().min(1).optional(),
  expiresAt: Joi.date().iso().optional(),
  status: Joi.string().valid('Active', 'Inactive').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });

/**
 * Joi validation schema for verifying a Coupon against purchase details.
 */
export const validateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().required(),
  purchaseAmount: Joi.number().min(0).required(),
});
export default createCouponSchema;
