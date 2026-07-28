import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const questionTypeValues = [
  'SingleChoice',
  'MultipleChoice',
  'TrueFalse',
  'ShortAnswer',
  'Essay',
  'FillBlank',
  'Matching',
  'Ordering',
  'Numeric',
  'FileUpload',
  'MCQ',
];

const optionSchema = Joi.object({
  id: Joi.string().optional(),
  _id: Joi.string().optional(),
  text: Joi.string().trim().required().messages({
    'string.empty': 'Option text is required',
  }),
  isCorrect: Joi.boolean().optional().default(false),
  order: Joi.number().integer().min(1).optional(),
  matchingPair: Joi.string().trim().optional().allow('', null),
});

export const createQuestionSchema = Joi.object({
  question: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Question text is required',
    'any.required': 'Question text is required',
  }),
  instructions: Joi.string().trim().optional().allow('', null),
  type: Joi.string()
    .valid(...questionTypeValues)
    .optional()
    .default('SingleChoice'),
  marks: Joi.number().min(0).optional().default(1),
  explanation: Joi.string().trim().optional().allow('', null),
  order: Joi.number().integer().min(1).optional(),
  options: Joi.array().items(optionSchema).optional(),
  correctAnswer: Joi.any().optional(),
  numericAnswer: Joi.number().optional(),
  numericTolerance: Joi.number().min(0).optional(),
  fillBlankAnswers: Joi.array().items(Joi.string().trim()).optional(),
});

export const updateQuestionSchema = Joi.object({
  question: Joi.string().trim().min(2).optional(),
  instructions: Joi.string().trim().optional().allow('', null),
  type: Joi.string().valid(...questionTypeValues).optional(),
  marks: Joi.number().min(0).optional(),
  explanation: Joi.string().trim().optional().allow('', null),
  order: Joi.number().integer().min(1).optional(),
  options: Joi.array().items(optionSchema).optional(),
  correctAnswer: Joi.any().optional(),
  numericAnswer: Joi.number().optional(),
  numericTolerance: Joi.number().min(0).optional(),
  fillBlankAnswers: Joi.array().items(Joi.string().trim()).optional(),
}).min(1);

export const createQuizSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Quiz title is required',
    'any.required': 'Quiz title is required',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  instructions: Joi.string().trim().max(2000).optional().allow('', null),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  sectionId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  duration: Joi.number().min(0).optional().default(0),
  passingScore: Joi.number().min(0).optional().default(50),
  passingPercentage: Joi.number().min(0).max(100).optional().default(60),
  attemptLimit: Joi.number().integer().min(0).optional().default(1),
  shuffleQuestions: Joi.boolean().optional().default(false),
  shuffleAnswers: Joi.boolean().optional().default(false),
  negativeMarking: Joi.boolean().optional().default(false),
  autoSubmit: Joi.boolean().optional().default(true),
  certificateRequirement: Joi.boolean().optional().default(false),
  showScoreAfterSubmission: Joi.boolean().optional().default(true),
  showCorrectAnswers: Joi.boolean().optional().default(true),
  showExplanations: Joi.boolean().optional().default(true),
  allowReview: Joi.boolean().optional().default(true),
  randomQuestions: Joi.boolean().optional().default(false),
  questionPool: Joi.number().min(0).optional().default(0),
  startDate: Joi.date().iso().optional().allow(null),
  endDate: Joi.date().iso().optional().allow(null),
  availabilityDate: Joi.date().iso().optional().allow(null),
  expiryDate: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional().default('Published'),
  questions: Joi.array().items(createQuestionSchema).optional(),
});

export const updateQuizSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional(),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  instructions: Joi.string().trim().max(2000).optional().allow('', null),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  sectionId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  duration: Joi.number().min(0).optional(),
  passingScore: Joi.number().min(0).optional(),
  passingPercentage: Joi.number().min(0).max(100).optional(),
  attemptLimit: Joi.number().integer().min(0).optional(),
  shuffleQuestions: Joi.boolean().optional(),
  shuffleAnswers: Joi.boolean().optional(),
  negativeMarking: Joi.boolean().optional(),
  autoSubmit: Joi.boolean().optional(),
  certificateRequirement: Joi.boolean().optional(),
  showScoreAfterSubmission: Joi.boolean().optional(),
  showCorrectAnswers: Joi.boolean().optional(),
  showExplanations: Joi.boolean().optional(),
  allowReview: Joi.boolean().optional(),
  randomQuestions: Joi.boolean().optional(),
  questionPool: Joi.number().min(0).optional(),
  startDate: Joi.date().iso().optional().allow(null),
  endDate: Joi.date().iso().optional().allow(null),
  availabilityDate: Joi.date().iso().optional().allow(null),
  expiryDate: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  questions: Joi.array().items(createQuestionSchema).optional(),
}).min(1);

export const reorderQuestionsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        order: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export default {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  optionSchema,
  reorderQuestionsSchema,
};
