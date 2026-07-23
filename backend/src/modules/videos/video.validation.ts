import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a video record (usually sent with file uploads).
 */
export const createVideoMetadataSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Video title is required',
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
  isPreview: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
  captions: Joi.array()
    .items(
      Joi.object({
        language: Joi.string().required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
});

/**
 * Joi validation schema for updating an existing video's metadata.
 */
export const updateVideoMetadataSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  isPreview: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
  captions: Joi.array()
    .items(
      Joi.object({
        language: Joi.string().required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
