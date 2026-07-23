import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Quiz.
 */
export const createQuizSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Quiz title is required',
  }),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).required(),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  duration: Joi.number().integer().min(0).optional(),
  passingScore: Joi.number().min(0).max(100).required(),
  shuffleQuestions: Joi.boolean().optional(),
  shuffleAnswers: Joi.boolean().optional(),
  negativeMarking: Joi.boolean().optional(),
  attemptLimit: Joi.number().integer().min(1).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'End date must be after start date',
  }),
  status: Joi.string().valid('Draft', 'Published').optional(),
});

/**
 * Joi validation schema for updating an existing Quiz.
 */
export const updateQuizSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  duration: Joi.number().integer().min(0).optional(),
  passingScore: Joi.number().min(0).max(100).optional(),
  shuffleQuestions: Joi.boolean().optional(),
  shuffleAnswers: Joi.boolean().optional(),
  negativeMarking: Joi.boolean().optional(),
  attemptLimit: Joi.number().integer().min(1).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'End date must be after start date',
  }),
  status: Joi.string().valid('Draft', 'Published').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
