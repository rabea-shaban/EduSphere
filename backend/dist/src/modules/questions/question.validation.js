"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAddQuizQuestionsSchema = exports.updateQuizQuestionSchema = exports.createQuizQuestionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for binding a question to a quiz.
 */
exports.createQuizQuestionSchema = joi_1.default.object({
    quizId: joi_1.default.string().pattern(mongoIdPattern).required(),
    questionBankId: joi_1.default.string().pattern(mongoIdPattern).required(),
    marks: joi_1.default.number().min(0).required(),
    order: joi_1.default.number().integer().min(1).required(),
});
/**
 * Joi validation schema for updating quiz question properties.
 */
exports.updateQuizQuestionSchema = joi_1.default.object({
    marks: joi_1.default.number().min(0).optional(),
    order: joi_1.default.number().integer().min(1).optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
/**
 * Joi validation schema for bulk adding questions to a quiz.
 */
exports.bulkAddQuizQuestionsSchema = joi_1.default.object({
    quizId: joi_1.default.string().pattern(mongoIdPattern).required(),
    questions: joi_1.default.array()
        .items(joi_1.default.object({
        questionBankId: joi_1.default.string().pattern(mongoIdPattern).required(),
        marks: joi_1.default.number().min(0).required(),
        order: joi_1.default.number().integer().min(1).required(),
    }))
        .min(1)
        .required(),
});
