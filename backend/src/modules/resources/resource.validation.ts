import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a resource.
 */
export const createResourceMetadataSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Resource title is required',
  }),
  description: Joi.string().trim().optional(),
  lessonId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid lesson ID format',
    'any.required': 'Lesson ID is required',
  }),
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  resourceType: Joi.string().valid('PDF', 'Image', 'ZIP', 'Code', 'Document', 'External Link').required().messages({
    'any.only': 'Resource type must be PDF, Image, ZIP, Code, Document, or External Link',
    'any.required': 'Resource type is required',
  }),
  url: Joi.string().uri().when('resourceType', {
    is: 'External Link',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }).messages({
    'any.required': 'URL is required for External Link resources',
  }),
  downloadable: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing resource.
 */
export const updateResourceMetadataSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  downloadable: Joi.boolean().optional(),
  url: Joi.string().uri().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createResourceMetadataSchema;
