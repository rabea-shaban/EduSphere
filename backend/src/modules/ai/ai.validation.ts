import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const aiChatSchema = Joi.object({
  prompt: Joi.string().trim().required().messages({
    'string.empty': 'Prompt is required',
  }),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const aiQuizGenSchema = Joi.object({
  text: Joi.string().trim().required(),
  questionType: Joi.string().valid('MCQ', 'True/False', 'Short Answer', 'Essay').optional().default('MCQ'),
  numberOfQuestions: Joi.number().integer().min(1).max(20).optional().default(5),
});

export const aiSummarizeSchema = Joi.object({
  text: Joi.string().trim().required(),
});

export const aiAssignmentHelperSchema = Joi.object({
  question: Joi.string().trim().required(),
});

export const aiEssayEvalSchema = Joi.object({
  essay: Joi.string().trim().required(),
});

export const aiModerateSchema = Joi.object({
  text: Joi.string().trim().required(),
});

export const aiStudyPlanSchema = Joi.object({
  examDate: Joi.date().iso().required(),
  weakSubjects: Joi.array().items(Joi.string().trim()).required(),
  availableHoursPerDay: Joi.number().min(1).max(24).required(),
});
