"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdParamSchema = exports.updateProgressSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for recording/updating lesson progress.
 */
exports.updateProgressSchema = joi_1.default.object({
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid lesson ID format',
        'any.required': 'Lesson ID is required',
    }),
    watchTime: joi_1.default.number().min(0).optional(),
    videoProgress: joi_1.default.number().min(0).max(100).optional(),
    completed: joi_1.default.boolean().optional(),
    lastPosition: joi_1.default.number().min(0).optional(),
});
exports.courseIdParamSchema = joi_1.default.object({
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
});
exports.default = exports.updateProgressSchema;
