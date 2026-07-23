import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a Subscription Plan.
 */
export const createSubscriptionPlanSchema = Joi.object({
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  name: Joi.string().trim().required().messages({
    'string.empty': 'Plan name is required',
  }),
  description: Joi.string().trim().optional(),
  subscriptionType: Joi.string().valid('Free', 'Monthly', 'Yearly', 'Lifetime').required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().trim().optional().default('USD'),
  features: Joi.array().items(Joi.string().trim()).required(),
  maxStudents: Joi.number().integer().min(1).required(),
  maxTeachers: Joi.number().integer().min(1).required(),
  maxCourses: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('Active', 'Inactive').optional(),
});

/**
 * Joi validation schema for updating an existing Subscription Plan.
 */
export const updateSubscriptionPlanSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  subscriptionType: Joi.string().valid('Free', 'Monthly', 'Yearly', 'Lifetime').optional(),
  price: Joi.number().min(0).optional(),
  currency: Joi.string().trim().optional(),
  features: Joi.array().items(Joi.string().trim()).optional(),
  maxStudents: Joi.number().integer().min(1).optional(),
  maxTeachers: Joi.number().integer().min(1).optional(),
  maxCourses: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('Active', 'Inactive').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createSubscriptionPlanSchema;
