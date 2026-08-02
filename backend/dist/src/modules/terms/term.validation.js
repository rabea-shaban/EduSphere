"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTermSchema = exports.createTermSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for creating a new Term.
 */
exports.createTermSchema = joi_1.default.object({
    name: joi_1.default.string().valid('First Term', 'Second Term').required().messages({
        'any.only': 'Term name must be First Term or Second Term',
        'any.required': 'Term name is required',
    }),
    order: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'Order must be a number',
        'any.required': 'Order is required',
    }),
    isActive: joi_1.default.boolean().optional(),
});
/**
 * Joi validation schema for updating an existing Term.
 */
exports.updateTermSchema = joi_1.default.object({
    name: joi_1.default.string().valid('First Term', 'Second Term').optional(),
    order: joi_1.default.number().integer().min(1).optional(),
    isActive: joi_1.default.boolean().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
