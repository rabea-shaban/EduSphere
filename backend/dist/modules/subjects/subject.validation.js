"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubjectSchema = exports.createSubjectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Subject.
 */
exports.createSubjectSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        'string.empty': 'Subject name is required',
    }),
    description: joi_1.default.string().trim().optional(),
    icon: joi_1.default.string().trim().optional(),
    color: joi_1.default.string().trim().optional(),
    educationStage: joi_1.default.string().valid('Primary', 'Preparatory', 'Secondary').required().messages({
        'any.only': 'Education stage must be Primary, Preparatory, or Secondary',
        'any.required': 'Education stage is required',
    }),
    grades: joi_1.default.array()
        .items(joi_1.default.string().pattern(mongoIdPattern).message('Invalid grade ID format'))
        .required()
        .messages({
        'any.required': 'Grades array is required',
    }),
    teacherIds: joi_1.default.array()
        .items(joi_1.default.string().pattern(mongoIdPattern).message('Invalid teacher ID format'))
        .optional(),
    isActive: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Subject.
 */
exports.updateSubjectSchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    icon: joi_1.default.string().trim().optional(),
    color: joi_1.default.string().trim().optional(),
    educationStage: joi_1.default.string().valid('Primary', 'Preparatory', 'Secondary').optional(),
    grades: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern).message('Invalid grade ID format')).optional(),
    teacherIds: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern).message('Invalid teacher ID format')).optional(),
    isActive: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createSubjectSchema;
