"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoMetadataSchema = exports.createVideoMetadataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a video record (usually sent with file uploads).
 */
exports.createVideoMetadataSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Video title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid lesson ID format',
        'any.required': 'Lesson ID is required',
    }),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    isPreview: joi_1.default.boolean().optional(),
    isPublished: joi_1.default.boolean().optional(),
    captions: joi_1.default.array()
        .items(joi_1.default.object({
        language: joi_1.default.string().required(),
        url: joi_1.default.string().uri().required(),
    }))
        .optional(),
});
/**
 * Joi validation schema for updating an existing video's metadata.
 */
exports.updateVideoMetadataSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    isPreview: joi_1.default.boolean().optional(),
    isPublished: joi_1.default.boolean().optional(),
    captions: joi_1.default.array()
        .items(joi_1.default.object({
        language: joi_1.default.string().required(),
        url: joi_1.default.string().uri().required(),
    }))
        .optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
