import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Section.
 */
export const createSectionSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Section title is required',
    'string.min': 'Section title must be at least 2 characters',
    'string.max': 'Section title cannot exceed 200 characters',
    'any.required': 'Section title is required',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  order: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Order must be at least 1',
    'number.integer': 'Order must be an integer',
  }),
  status: Joi.string()
    .valid('Draft', 'Published', 'Hidden', 'Archived')
    .optional()
    .default('Draft'),
  visibility: Joi.string()
    .valid('Public', 'Private', 'Enrolled')
    .optional()
    .default('Enrolled'),
  isPublished: Joi.boolean().optional(),
  estimatedDuration: Joi.number().min(0).optional(),
  completionRule: Joi.string()
    .valid('AllLessons', 'MinimumLessons', 'AnyLesson')
    .optional()
    .default('AllLessons'),
  minimumLessonsRequired: Joi.number().integer().min(0).optional(),
});

/**
 * Joi validation schema for updating an existing Section (partial).
 */
export const updateSectionSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional().messages({
    'string.min': 'Section title must be at least 2 characters',
    'string.max': 'Section title cannot exceed 200 characters',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  order: Joi.number().integer().min(1).optional(),
  status: Joi.string()
    .valid('Draft', 'Published', 'Hidden', 'Archived')
    .optional(),
  visibility: Joi.string()
    .valid('Public', 'Private', 'Enrolled')
    .optional(),
  isPublished: Joi.boolean().optional(),
  estimatedDuration: Joi.number().min(0).optional(),
  completionRule: Joi.string()
    .valid('AllLessons', 'MinimumLessons', 'AnyLesson')
    .optional(),
  minimumLessonsRequired: Joi.number().integer().min(0).optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

/**
 * Joi validation schema for reordering sections.
 */
export const reorderSectionsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().pattern(mongoIdPattern).required().messages({
          'string.pattern.base': 'Invalid section ID format',
          'any.required': 'Section ID is required',
        }),
        order: Joi.number().integer().min(1).required().messages({
          'number.min': 'Order must be at least 1',
          'any.required': 'Order is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item must be provided for reordering',
      'any.required': 'Items array is required',
    }),
});

export default { createSectionSchema, updateSectionSchema, reorderSectionsSchema };
