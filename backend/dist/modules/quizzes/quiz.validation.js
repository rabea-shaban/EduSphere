"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizSchema = exports.createQuizSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Quiz.
 */
exports.createQuizSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Quiz title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    duration: joi_1.default.number().integer().min(0).optional(),
    passingScore: joi_1.default.number().min(0).max(100).required(),
    shuffleQuestions: joi_1.default.boolean().optional(),
    shuffleAnswers: joi_1.default.boolean().optional(),
    negativeMarking: joi_1.default.boolean().optional(),
    attemptLimit: joi_1.default.number().integer().min(1).optional(),
    startDate: joi_1.default.date().iso().optional(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
});
/**
 * Joi validation schema for updating an existing Quiz.
 */
exports.updateQuizSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    duration: joi_1.default.number().integer().min(0).optional(),
    passingScore: joi_1.default.number().min(0).max(100).optional(),
    shuffleQuestions: joi_1.default.boolean().optional(),
    shuffleAnswers: joi_1.default.boolean().optional(),
    negativeMarking: joi_1.default.boolean().optional(),
    attemptLimit: joi_1.default.number().integer().min(1).optional(),
    startDate: joi_1.default.date().iso().optional(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).optional().messages({
        'date.min': 'End date must be after start date',
    }),
    status: joi_1.default.string().valid('Draft', 'Published').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
