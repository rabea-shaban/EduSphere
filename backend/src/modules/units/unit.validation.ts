import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Unit.
 */
export const createUnitSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Unit title is required',
  }),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  order: Joi.number().integer().min(1).required().messages({
    'number.base': 'Order must be a number',
    'any.required': 'Order is required',
  }),
  isPublished: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Unit.
 */
export const updateUnitSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  order: Joi.number().integer().min(1).optional(),
  isPublished: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createUnitSchema;
