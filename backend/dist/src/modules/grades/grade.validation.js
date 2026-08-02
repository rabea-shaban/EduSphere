"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGradeSchema = exports.createGradeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for creating a new Grade.
 */
exports.createGradeSchema = joi_1.default.object({
    name: joi_1.default.object({
        ar: joi_1.default.string().trim().required().messages({
            'string.empty': 'Arabic grade name is required',
        }),
        en: joi_1.default.string().trim().required().messages({
            'string.empty': 'English grade name is required',
        }),
    }).required(),
    order: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'Order must be a number',
        'any.required': 'Order is required',
    }),
    educationStage: joi_1.default.string().valid('Primary', 'Preparatory', 'Secondary', 'Azhar', 'Baccalaureate', 'ComputerScience').required().messages({
        'any.only': 'Education stage must be valid',
        'any.required': 'Education stage is required',
    }),
    description: joi_1.default.string().trim().optional(),
    isActive: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Grade.
 */
exports.updateGradeSchema = joi_1.default.object({
    name: joi_1.default.object({
        ar: joi_1.default.string().trim().optional(),
        en: joi_1.default.string().trim().optional(),
    }).optional(),
    order: joi_1.default.number().integer().min(1).optional(),
    educationStage: joi_1.default.string().valid('Primary', 'Preparatory', 'Secondary', 'Azhar', 'Baccalaureate', 'ComputerScience').optional(),
    description: joi_1.default.string().trim().optional(),
    isActive: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
