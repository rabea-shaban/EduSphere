import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a Log entry.
 */
export const createActivityLogSchema = Joi.object({
  userId: Joi.string().pattern(mongoIdPattern).required(),
  action: Joi.string().trim().required(),
  category: Joi.string().valid('Login', 'Course', 'Payment', 'Security', 'Admin').required(),
  details: Joi.any().optional(),
  ipAddress: Joi.string().trim().optional(),
  userAgent: Joi.string().trim().optional(),
});

export default createActivityLogSchema;
