import Joi from 'joi';

/**
 * Joi validation schema for creating a new Academic Year.
 */
export const createAcademicYearSchema = Joi.object({
  title: Joi.string()
    .trim()
    .pattern(/^\d{4}\s*\/\s*\d{4}$/) // Enforces e.g. "2026 / 2027" or "2026/2027"
    .required()
    .messages({
      'string.empty': 'Academic year title is required',
      'string.pattern.base': 'Academic year title must follow the format YYYY / YYYY (e.g., 2026 / 2027)',
    }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.min': 'End date must be after the start date',
    'any.required': 'End date is required',
  }),
  isCurrent: Joi.boolean().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PLANNED', 'ARCHIVED').optional(),
});

/**
 * Joi validation schema for updating an existing Academic Year.
 */
export const updateAcademicYearSchema = Joi.object({
  title: Joi.string()
    .trim()
    .pattern(/^\d{4}\s*\/\s*\d{4}$/)
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  isCurrent: Joi.boolean().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PLANNED', 'ARCHIVED').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
