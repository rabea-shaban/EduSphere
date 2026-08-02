"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAcademicYearSchema = exports.createAcademicYearSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for creating a new Academic Year.
 */
exports.createAcademicYearSchema = joi_1.default.object({
    title: joi_1.default.string()
        .trim()
        .pattern(/^\d{4}\s*\/\s*\d{4}$/) // Enforces e.g. "2026 / 2027" or "2026/2027"
        .required()
        .messages({
        'string.empty': 'Academic year title is required',
        'string.pattern.base': 'Academic year title must follow the format YYYY / YYYY (e.g., 2026 / 2027)',
    }),
    startDate: joi_1.default.date().required().messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required',
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required().messages({
        'date.base': 'End date must be a valid date',
        'date.min': 'End date must be after the start date',
        'any.required': 'End date is required',
    }),
    isCurrent: joi_1.default.boolean().optional(),
    status: joi_1.default.string().valid('ACTIVE', 'INACTIVE', 'PLANNED', 'ARCHIVED').optional(),
});
/**
 * Joi validation schema for updating an existing Academic Year.
 */
exports.updateAcademicYearSchema = joi_1.default.object({
    title: joi_1.default.string()
        .trim()
        .pattern(/^\d{4}\s*\/\s*\d{4}$/)
        .optional(),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).optional(),
    isCurrent: joi_1.default.boolean().optional(),
    status: joi_1.default.string().valid('ACTIVE', 'INACTIVE', 'PLANNED', 'ARCHIVED').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
