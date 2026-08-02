"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResourceMetadataSchema = exports.createResourceMetadataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a resource.
 */
exports.createResourceMetadataSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Resource title is required',
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
    resourceType: joi_1.default.string().valid('PDF', 'Image', 'ZIP', 'Code', 'Document', 'External Link').required().messages({
        'any.only': 'Resource type must be PDF, Image, ZIP, Code, Document, or External Link',
        'any.required': 'Resource type is required',
    }),
    url: joi_1.default.string().uri().when('resourceType', {
        is: 'External Link',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }).messages({
        'any.required': 'URL is required for External Link resources',
    }),
    downloadable: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing resource.
 */
exports.updateResourceMetadataSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    downloadable: joi_1.default.boolean().optional(),
    url: joi_1.default.string().uri().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createResourceMetadataSchema;
