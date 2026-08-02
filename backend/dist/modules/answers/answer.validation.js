"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeAnswerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for teachers grading subjective student answers manually.
 */
exports.gradeAnswerSchema = joi_1.default.object({
    marks: joi_1.default.number().min(0).required().messages({
        'number.base': 'Marks must be a number',
        'any.required': 'Marks are required',
    }),
    isCorrect: joi_1.default.boolean().required().messages({
        'any.required': 'Correct status (isCorrect) is required',
    }),
});
exports.default = exports.gradeAnswerSchema;
