"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderQuestionsSchema = exports.updateQuizSchema = exports.createQuizSchema = exports.updateQuestionSchema = exports.createQuestionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
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
const optionSchema = joi_1.default.object({
    id: joi_1.default.string().optional(),
    _id: joi_1.default.string().optional(),
    text: joi_1.default.string().trim().required().messages({
        'string.empty': 'Option text is required',
    }),
    isCorrect: joi_1.default.boolean().optional().default(false),
    order: joi_1.default.number().integer().min(1).optional(),
    matchingPair: joi_1.default.string().trim().optional().allow('', null),
});
exports.createQuestionSchema = joi_1.default.object({
    question: joi_1.default.string().trim().min(2).required().messages({
        'string.empty': 'Question text is required',
        'any.required': 'Question text is required',
    }),
    instructions: joi_1.default.string().trim().optional().allow('', null),
    type: joi_1.default.string()
        .valid(...questionTypeValues)
        .optional()
        .default('SingleChoice'),
    marks: joi_1.default.number().min(0).optional().default(1),
    explanation: joi_1.default.string().trim().optional().allow('', null),
    order: joi_1.default.number().integer().min(1).optional(),
    options: joi_1.default.array().items(optionSchema).optional(),
    correctAnswer: joi_1.default.any().optional(),
    numericAnswer: joi_1.default.number().optional(),
    numericTolerance: joi_1.default.number().min(0).optional(),
    fillBlankAnswers: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
});
exports.updateQuestionSchema = joi_1.default.object({
    question: joi_1.default.string().trim().min(2).optional(),
    instructions: joi_1.default.string().trim().optional().allow('', null),
    type: joi_1.default.string().valid(...questionTypeValues).optional(),
    marks: joi_1.default.number().min(0).optional(),
    explanation: joi_1.default.string().trim().optional().allow('', null),
    order: joi_1.default.number().integer().min(1).optional(),
    options: joi_1.default.array().items(optionSchema).optional(),
    correctAnswer: joi_1.default.any().optional(),
    numericAnswer: joi_1.default.number().optional(),
    numericTolerance: joi_1.default.number().min(0).optional(),
    fillBlankAnswers: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
}).min(1);
exports.createQuizSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required().messages({
        'string.empty': 'Quiz title is required',
        'any.required': 'Quiz title is required',
    }),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    instructions: joi_1.default.string().trim().max(2000).optional().allow('', null),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    duration: joi_1.default.number().min(0).optional().default(0),
    passingScore: joi_1.default.number().min(0).optional().default(50),
    passingPercentage: joi_1.default.number().min(0).max(100).optional().default(60),
    attemptLimit: joi_1.default.number().integer().min(0).optional().default(1),
    shuffleQuestions: joi_1.default.boolean().optional().default(false),
    shuffleAnswers: joi_1.default.boolean().optional().default(false),
    negativeMarking: joi_1.default.boolean().optional().default(false),
    autoSubmit: joi_1.default.boolean().optional().default(true),
    certificateRequirement: joi_1.default.boolean().optional().default(false),
    showScoreAfterSubmission: joi_1.default.boolean().optional().default(true),
    showCorrectAnswers: joi_1.default.boolean().optional().default(true),
    showExplanations: joi_1.default.boolean().optional().default(true),
    allowReview: joi_1.default.boolean().optional().default(true),
    randomQuestions: joi_1.default.boolean().optional().default(false),
    questionPool: joi_1.default.number().min(0).optional().default(0),
    startDate: joi_1.default.date().iso().optional().allow(null),
    endDate: joi_1.default.date().iso().optional().allow(null),
    availabilityDate: joi_1.default.date().iso().optional().allow(null),
    expiryDate: joi_1.default.date().iso().optional().allow(null),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional().default('Published'),
    questions: joi_1.default.array().items(exports.createQuestionSchema).optional(),
});
exports.updateQuizSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).optional(),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    instructions: joi_1.default.string().trim().max(2000).optional().allow('', null),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    duration: joi_1.default.number().min(0).optional(),
    passingScore: joi_1.default.number().min(0).optional(),
    passingPercentage: joi_1.default.number().min(0).max(100).optional(),
    attemptLimit: joi_1.default.number().integer().min(0).optional(),
    shuffleQuestions: joi_1.default.boolean().optional(),
    shuffleAnswers: joi_1.default.boolean().optional(),
    negativeMarking: joi_1.default.boolean().optional(),
    autoSubmit: joi_1.default.boolean().optional(),
    certificateRequirement: joi_1.default.boolean().optional(),
    showScoreAfterSubmission: joi_1.default.boolean().optional(),
    showCorrectAnswers: joi_1.default.boolean().optional(),
    showExplanations: joi_1.default.boolean().optional(),
    allowReview: joi_1.default.boolean().optional(),
    randomQuestions: joi_1.default.boolean().optional(),
    questionPool: joi_1.default.number().min(0).optional(),
    startDate: joi_1.default.date().iso().optional().allow(null),
    endDate: joi_1.default.date().iso().optional().allow(null),
    availabilityDate: joi_1.default.date().iso().optional().allow(null),
    expiryDate: joi_1.default.date().iso().optional().allow(null),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
    questions: joi_1.default.array().items(exports.createQuestionSchema).optional(),
}).min(1);
exports.reorderQuestionsSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        id: joi_1.default.string().required(),
        order: joi_1.default.number().integer().min(1).required(),
    }))
        .min(1)
        .required(),
});
exports.default = {
    createQuizSchema: exports.createQuizSchema,
    updateQuizSchema: exports.updateQuizSchema,
    createQuestionSchema: exports.createQuestionSchema,
    updateQuestionSchema: exports.updateQuestionSchema,
    optionSchema,
    reorderQuestionsSchema: exports.reorderQuestionsSchema,
};
