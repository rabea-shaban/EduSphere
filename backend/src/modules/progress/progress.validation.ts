import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for recording/updating lesson progress.
 */
export const updateProgressSchema = Joi.object({
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  lessonId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid lesson ID format',
    'any.required': 'Lesson ID is required',
  }),
  watchTime: Joi.number().min(0).optional(),
  videoProgress: Joi.number().min(0).max(100).optional(),
  completed: Joi.boolean().optional(),
  lastPosition: Joi.number().min(0).optional(),
});
export default updateProgressSchema;
