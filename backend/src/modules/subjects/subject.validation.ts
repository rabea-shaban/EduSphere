import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Subject.
 */
export const createSubjectSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Subject name is required',
  }),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
  educationStage: Joi.string().valid('Primary', 'Preparatory', 'Secondary').required().messages({
    'any.only': 'Education stage must be Primary, Preparatory, or Secondary',
    'any.required': 'Education stage is required',
  }),
  grades: Joi.array()
    .items(Joi.string().pattern(mongoIdPattern).message('Invalid grade ID format'))
    .required()
    .messages({
      'any.required': 'Grades array is required',
    }),
  teacherIds: Joi.array()
    .items(Joi.string().pattern(mongoIdPattern).message('Invalid teacher ID format'))
    .optional(),
  isActive: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Subject.
 */
export const updateSubjectSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
  educationStage: Joi.string().valid('Primary', 'Preparatory', 'Secondary').optional(),
  grades: Joi.array().items(Joi.string().pattern(mongoIdPattern).message('Invalid grade ID format')).optional(),
  teacherIds: Joi.array().items(Joi.string().pattern(mongoIdPattern).message('Invalid teacher ID format')).optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createSubjectSchema;
