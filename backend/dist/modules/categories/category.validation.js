"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a Category.
 */
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        'string.empty': 'Category name is required',
    }),
    slug: joi_1.default.string().trim().lowercase().required().messages({
        'string.empty': 'Slug is required',
    }),
    description: joi_1.default.string().trim().optional(),
    type: joi_1.default.string().valid('Blog', 'Course', 'General').optional().default('General'),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
/**
 * Joi validation schema for updating an existing Category.
 */
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    slug: joi_1.default.string().trim().lowercase().optional(),
    description: joi_1.default.string().trim().optional(),
    type: joi_1.default.string().valid('Blog', 'Course', 'General').optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createCategorySchema;
