"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Course.
 */
exports.createCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Course title is required',
        'string.min': 'Course title must be at least 3 characters',
    }),
    description: joi_1.default.string().trim().optional(),
    thumbnail: joi_1.default.string().trim().uri().optional(),
    previewVideo: joi_1.default.string().trim().uri().optional(),
    teacher: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid teacher ID format',
        'any.required': 'Teacher is required',
    }),
    academicYear: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid academic year ID format',
        'any.required': 'Academic year is required',
    }),
    grade: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid grade ID format',
        'any.required': 'Grade is required',
    }),
    subject: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid subject ID format',
        'any.required': 'Subject is required',
    }),
    term: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid term ID format',
        'any.required': 'Term is required',
    }),
    language: joi_1.default.string().trim().optional(),
    price: joi_1.default.number().min(0).optional(),
    discountPrice: joi_1.default.number().min(0).max(joi_1.default.ref('price')).optional().messages({
        'number.max': 'Discount price must be less than or equal to original price',
    }),
    duration: joi_1.default.number().min(0).optional(),
    level: joi_1.default.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    requirements: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    objectives: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
    isFeatured: joi_1.default.boolean().optional(),
    isFree: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Course.
 */
exports.updateCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(3).max(100).optional(),
    description: joi_1.default.string().trim().optional(),
    thumbnail: joi_1.default.string().trim().uri().optional(),
    previewVideo: joi_1.default.string().trim().uri().optional(),
    teacher: joi_1.default.string().pattern(mongoIdPattern).optional(),
    academicYear: joi_1.default.string().pattern(mongoIdPattern).optional(),
    grade: joi_1.default.string().pattern(mongoIdPattern).optional(),
    subject: joi_1.default.string().pattern(mongoIdPattern).optional(),
    term: joi_1.default.string().pattern(mongoIdPattern).optional(),
    language: joi_1.default.string().trim().optional(),
    price: joi_1.default.number().min(0).optional(),
    discountPrice: joi_1.default.number().min(0).max(joi_1.default.ref('price')).optional().messages({
        'number.max': 'Discount price must be less than or equal to original price',
    }),
    duration: joi_1.default.number().min(0).optional(),
    level: joi_1.default.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    requirements: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    objectives: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
    isFeatured: joi_1.default.boolean().optional(),
    isFree: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
