"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLessonSchema = exports.createLessonSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Lesson.
 */
exports.createLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Lesson title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid unit ID format',
        'any.required': 'Unit ID is required',
    }),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    lessonType: joi_1.default.string().valid('Video', 'PDF', 'Quiz', 'Assignment', 'Text').required().messages({
        'any.only': 'Lesson type must be Video, PDF, Quiz, Assignment, or Text',
        'any.required': 'Lesson type is required',
    }),
    duration: joi_1.default.number().min(0).optional(),
    order: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'Order must be a number',
        'any.required': 'Order is required',
    }),
    isPreview: joi_1.default.boolean().optional(),
    isPublished: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Lesson.
 */
exports.updateLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonType: joi_1.default.string().valid('Video', 'PDF', 'Quiz', 'Assignment', 'Text').optional(),
    duration: joi_1.default.number().min(0).optional(),
    order: joi_1.default.number().integer().min(1).optional(),
    isPreview: joi_1.default.boolean().optional(),
    isPublished: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createLessonSchema;
