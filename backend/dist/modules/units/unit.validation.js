"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitSchema = exports.createUnitSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Unit.
 */
exports.createUnitSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Unit title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    order: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'Order must be a number',
        'any.required': 'Order is required',
    }),
    isPublished: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Unit.
 */
exports.updateUnitSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    order: joi_1.default.number().integer().min(1).optional(),
    isPublished: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createUnitSchema;
