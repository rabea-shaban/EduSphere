import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for binding a question to a quiz.
 */
export const createQuizQuestionSchema = Joi.object({
  quizId: Joi.string().pattern(mongoIdPattern).required(),
  questionBankId: Joi.string().pattern(mongoIdPattern).required(),
  marks: Joi.number().min(0).required(),
  order: Joi.number().integer().min(1).required(),
});

/**
 * Joi validation schema for updating quiz question properties.
 */
export const updateQuizQuestionSchema = Joi.object({
  marks: Joi.number().min(0).optional(),
  order: Joi.number().integer().min(1).optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });

/**
 * Joi validation schema for bulk adding questions to a quiz.
 */
export const bulkAddQuizQuestionsSchema = Joi.object({
  quizId: Joi.string().pattern(mongoIdPattern).required(),
  questions: Joi.array()
    .items(
      Joi.object({
        questionBankId: Joi.string().pattern(mongoIdPattern).required(),
        marks: Joi.number().min(0).required(),
        order: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});
