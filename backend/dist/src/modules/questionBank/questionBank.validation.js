"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuestionBankSchema = exports.createQuestionBankSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Question in the Bank.
 */
exports.createQuestionBankSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Question title is required',
    }),
    question: joi_1.default.string().trim().required().messages({
        'string.empty': 'Question body text is required',
    }),
    type: joi_1.default.string()
        .valid('MCQ', 'Multiple Answers', 'True False', 'Fill Blank', 'Short Answer', 'Essay', 'Matching', 'Ordering')
        .required(),
    difficulty: joi_1.default.string().valid('Easy', 'Medium', 'Hard').required(),
    subject: joi_1.default.string().pattern(mongoIdPattern).required(),
    grade: joi_1.default.string().pattern(mongoIdPattern).required(),
    teacher: joi_1.default.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
    lesson: joi_1.default.string().pattern(mongoIdPattern).optional(),
    course: joi_1.default.string().pattern(mongoIdPattern).optional(),
    options: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    correctAnswer: joi_1.default.any().required().messages({
        'any.required': 'Correct answer is required',
    }),
    marks: joi_1.default.number().min(0).required(),
    explanation: joi_1.default.string().trim().optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Active', 'Draft').optional(),
});
/**
 * Joi validation schema for updating a Question in the Bank.
 */
exports.updateQuestionBankSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    question: joi_1.default.string().trim().optional(),
    type: joi_1.default.string().valid('MCQ', 'Multiple Answers', 'True False', 'Fill Blank', 'Short Answer', 'Essay', 'Matching', 'Ordering').optional(),
    difficulty: joi_1.default.string().valid('Easy', 'Medium', 'Hard').optional(),
    subject: joi_1.default.string().pattern(mongoIdPattern).optional(),
    grade: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lesson: joi_1.default.string().pattern(mongoIdPattern).optional(),
    course: joi_1.default.string().pattern(mongoIdPattern).optional(),
    options: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    correctAnswer: joi_1.default.any().optional(),
    marks: joi_1.default.number().min(0).optional(),
    explanation: joi_1.default.string().trim().optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Active', 'Draft').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
