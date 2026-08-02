"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAttemptSchema = exports.startAttemptSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for starting a quiz/exam attempt.
 */
exports.startAttemptSchema = joi_1.default.object({
    quizId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid quiz ID format',
        'any.required': 'Quiz ID is required',
    }),
});
exports.submitAttemptSchema = joi_1.default.object({
    quizId: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    score: joi_1.default.number().optional().default(0),
    percentage: joi_1.default.number().optional().default(0),
    passed: joi_1.default.boolean().optional(),
    answers: joi_1.default.array()
        .items(joi_1.default.object({
        questionId: joi_1.default.any().optional(),
        studentAnswer: joi_1.default.any().optional(),
        correctAnswer: joi_1.default.any().optional(),
        isCorrect: joi_1.default.boolean().optional(),
        marks: joi_1.default.number().optional(),
    }))
        .optional(),
});
