import Joi from 'joi';

/**
 * Joi validation schema for teachers grading subjective student answers manually.
 */
export const gradeAnswerSchema = Joi.object({
  marks: Joi.number().min(0).required().messages({
    'number.base': 'Marks must be a number',
    'any.required': 'Marks are required',
  }),
  isCorrect: Joi.boolean().required().messages({
    'any.required': 'Correct status (isCorrect) is required',
  }),
});
export default gradeAnswerSchema;
