import Joi from 'joi';

/**
 * Joi validation schema for creating a new Term.
 */
export const createTermSchema = Joi.object({
  name: Joi.string().valid('First Term', 'Second Term').required().messages({
    'any.only': 'Term name must be First Term or Second Term',
    'any.required': 'Term name is required',
  }),
  order: Joi.number().integer().min(1).required().messages({
    'number.base': 'Order must be a number',
    'any.required': 'Order is required',
  }),
  isActive: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Term.
 */
export const updateTermSchema = Joi.object({
  name: Joi.string().valid('First Term', 'Second Term').optional(),
  order: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
