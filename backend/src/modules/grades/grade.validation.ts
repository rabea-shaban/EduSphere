import Joi from 'joi';

/**
 * Joi validation schema for creating a new Grade.
 */
export const createGradeSchema = Joi.object({
  name: Joi.object({
    ar: Joi.string().trim().required().messages({
      'string.empty': 'Arabic grade name is required',
    }),
    en: Joi.string().trim().required().messages({
      'string.empty': 'English grade name is required',
    }),
  }).required(),
  order: Joi.number().integer().min(1).required().messages({
    'number.base': 'Order must be a number',
    'any.required': 'Order is required',
  }),
  educationStage: Joi.string().valid('Primary', 'Preparatory', 'Secondary', 'Azhar', 'Baccalaureate', 'ComputerScience').required().messages({
    'any.only': 'Education stage must be valid',
    'any.required': 'Education stage is required',
  }),
  description: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Grade.
 */
export const updateGradeSchema = Joi.object({
  name: Joi.object({
    ar: Joi.string().trim().optional(),
    en: Joi.string().trim().optional(),
  }).optional(),
  order: Joi.number().integer().min(1).optional(),
  educationStage: Joi.string().valid('Primary', 'Preparatory', 'Secondary', 'Azhar', 'Baccalaureate', 'ComputerScience').optional(),
  description: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
