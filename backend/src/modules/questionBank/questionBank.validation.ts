import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Question in the Bank.
 */
export const createQuestionBankSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Question title is required',
  }),
  question: Joi.string().trim().required().messages({
    'string.empty': 'Question body text is required',
  }),
  type: Joi.string()
    .valid('MCQ', 'Multiple Answers', 'True False', 'Fill Blank', 'Short Answer', 'Essay', 'Matching', 'Ordering')
    .required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  subject: Joi.string().pattern(mongoIdPattern).required(),
  grade: Joi.string().pattern(mongoIdPattern).required(),
  teacher: Joi.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
  lesson: Joi.string().pattern(mongoIdPattern).optional(),
  course: Joi.string().pattern(mongoIdPattern).optional(),
  options: Joi.array().items(Joi.string().trim()).optional(),
  correctAnswer: Joi.any().required().messages({
    'any.required': 'Correct answer is required',
  }),
  marks: Joi.number().min(0).required(),
  explanation: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Active', 'Draft').optional(),
});

/**
 * Joi validation schema for updating a Question in the Bank.
 */
export const updateQuestionBankSchema = Joi.object({
  title: Joi.string().trim().optional(),
  question: Joi.string().trim().optional(),
  type: Joi.string().valid('MCQ', 'Multiple Answers', 'True False', 'Fill Blank', 'Short Answer', 'Essay', 'Matching', 'Ordering').optional(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').optional(),
  subject: Joi.string().pattern(mongoIdPattern).optional(),
  grade: Joi.string().pattern(mongoIdPattern).optional(),
  lesson: Joi.string().pattern(mongoIdPattern).optional(),
  course: Joi.string().pattern(mongoIdPattern).optional(),
  options: Joi.array().items(Joi.string().trim()).optional(),
  correctAnswer: Joi.any().optional(),
  marks: Joi.number().min(0).optional(),
  explanation: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Active', 'Draft').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
