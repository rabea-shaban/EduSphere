import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for starting a quiz/exam attempt.
 */
export const startAttemptSchema = Joi.object({
  quizId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid quiz ID format',
    'any.required': 'Quiz ID is required',
  }),
});

export const submitAttemptSchema = Joi.object({
  quizId: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  score: Joi.number().optional().default(0),
  percentage: Joi.number().optional().default(0),
  passed: Joi.boolean().optional(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.any().optional(),
        studentAnswer: Joi.any().optional(),
        correctAnswer: Joi.any().optional(),
        isCorrect: Joi.boolean().optional(),
        marks: Joi.number().optional(),
      })
    )
    .optional(),
});
