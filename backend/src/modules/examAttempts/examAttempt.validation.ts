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

/**
 * Joi validation schema for submitting quiz answers.
 */
export const submitAttemptSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().pattern(mongoIdPattern).required().messages({
          'string.pattern.base': 'Invalid question ID format',
        }),
        studentAnswer: Joi.any().required().messages({
          'any.required': 'Student answer is required',
        }),
      })
    )
    .required()
    .messages({
      'any.required': 'Answers array is required',
    }),
});
