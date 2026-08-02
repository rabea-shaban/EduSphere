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
    title: joi_1.default.string().trim().min(2).max(300).required().messages({
        'string.empty': 'Course title is required',
        'string.min': 'Course title must be at least 2 characters',
    }),
    description: joi_1.default.string().trim().optional().allow('', null),
    thumbnail: joi_1.default.string().trim().optional().allow('', null),
    thumbnailUrl: joi_1.default.string().trim().optional().allow('', null),
    category: joi_1.default.string().trim().optional().allow('', null),
    previewVideo: joi_1.default.string().trim().optional().allow('', null),
    teacher: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    academicYear: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    grade: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    subject: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    term: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    language: joi_1.default.string().trim().optional().allow('', null),
    price: joi_1.default.number().min(0).optional(),
    discountPrice: joi_1.default.number().min(0).optional(),
    duration: joi_1.default.number().min(0).optional(),
    level: joi_1.default.string().optional().allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    requirements: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    objectives: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
    isFeatured: joi_1.default.boolean().optional(),
    isFree: joi_1.default.boolean().optional(),
}).unknown(true);
/**
 * Joi validation schema for updating an existing Course.
 */
exports.updateCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(300).optional(),
    description: joi_1.default.string().trim().optional().allow('', null),
    thumbnail: joi_1.default.string().trim().optional().allow('', null),
    thumbnailUrl: joi_1.default.string().trim().optional().allow('', null),
    category: joi_1.default.string().trim().optional().allow('', null),
    previewVideo: joi_1.default.string().trim().optional().allow('', null),
    teacher: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    academicYear: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    grade: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    subject: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    term: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    language: joi_1.default.string().trim().optional().allow('', null),
    price: joi_1.default.number().min(0).optional(),
    discountPrice: joi_1.default.number().min(0).optional(),
    duration: joi_1.default.number().min(0).optional(),
    level: joi_1.default.string().optional().allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    requirements: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    objectives: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
    isFeatured: joi_1.default.boolean().optional(),
    isFree: joi_1.default.boolean().optional(),
})
    .unknown(true)
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
