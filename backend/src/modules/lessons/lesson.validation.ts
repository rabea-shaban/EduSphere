import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Lesson.
 */
export const createLessonSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Lesson title is required',
  }),
  description: Joi.string().trim().optional(),
  unitId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid unit ID format',
    'any.required': 'Unit ID is required',
  }),
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  lessonType: Joi.string().valid('Video', 'PDF', 'Quiz', 'Assignment', 'Text').required().messages({
    'any.only': 'Lesson type must be Video, PDF, Quiz, Assignment, or Text',
    'any.required': 'Lesson type is required',
  }),
  duration: Joi.number().min(0).optional(),
  order: Joi.number().integer().min(1).required().messages({
    'number.base': 'Order must be a number',
    'any.required': 'Order is required',
  }),
  isPreview: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Lesson.
 */
export const updateLessonSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  unitId: Joi.string().pattern(mongoIdPattern).optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonType: Joi.string().valid('Video', 'PDF', 'Quiz', 'Assignment', 'Text').optional(),
  duration: Joi.number().min(0).optional(),
  order: Joi.number().integer().min(1).optional(),
  isPreview: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createLessonSchema;
