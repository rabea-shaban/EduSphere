"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSectionsSchema = exports.updateSectionSchema = exports.createSectionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Section.
 */
exports.createSectionSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required().messages({
        'string.empty': 'Section title is required',
        'string.min': 'Section title must be at least 2 characters',
        'string.max': 'Section title cannot exceed 200 characters',
        'any.required': 'Section title is required',
    }),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    order: joi_1.default.number().integer().min(1).optional().messages({
        'number.min': 'Order must be at least 1',
        'number.integer': 'Order must be an integer',
    }),
    status: joi_1.default.string()
        .valid('Draft', 'Published', 'Hidden', 'Archived')
        .optional()
        .default('Draft'),
    visibility: joi_1.default.string()
        .valid('Public', 'Private', 'Enrolled')
        .optional()
        .default('Enrolled'),
    isPublished: joi_1.default.boolean().optional(),
    estimatedDuration: joi_1.default.number().min(0).optional(),
    completionRule: joi_1.default.string()
        .valid('AllLessons', 'MinimumLessons', 'AnyLesson')
        .optional()
        .default('AllLessons'),
    minimumLessonsRequired: joi_1.default.number().integer().min(0).optional(),
});
/**
 * Joi validation schema for updating an existing Section (partial).
 */
exports.updateSectionSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).optional().messages({
        'string.min': 'Section title must be at least 2 characters',
        'string.max': 'Section title cannot exceed 200 characters',
    }),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    order: joi_1.default.number().integer().min(1).optional(),
    status: joi_1.default.string()
        .valid('Draft', 'Published', 'Hidden', 'Archived')
        .optional(),
    visibility: joi_1.default.string()
        .valid('Public', 'Private', 'Enrolled')
        .optional(),
    isPublished: joi_1.default.boolean().optional(),
    estimatedDuration: joi_1.default.number().min(0).optional(),
    completionRule: joi_1.default.string()
        .valid('AllLessons', 'MinimumLessons', 'AnyLesson')
        .optional(),
    minimumLessonsRequired: joi_1.default.number().integer().min(0).optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be provided for update',
});
/**
 * Joi validation schema for reordering sections.
 */
exports.reorderSectionsSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        id: joi_1.default.string().pattern(mongoIdPattern).required().messages({
            'string.pattern.base': 'Invalid section ID format',
            'any.required': 'Section ID is required',
        }),
        order: joi_1.default.number().integer().min(1).required().messages({
            'number.min': 'Order must be at least 1',
            'any.required': 'Order is required',
        }),
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'At least one item must be provided for reordering',
        'any.required': 'Items array is required',
    }),
});
exports.default = { createSectionSchema: exports.createSectionSchema, updateSectionSchema: exports.updateSectionSchema, reorderSectionsSchema: exports.reorderSectionsSchema };
