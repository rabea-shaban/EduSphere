"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionPlanSchema = exports.createSubscriptionPlanSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a Subscription Plan.
 */
exports.createSubscriptionPlanSchema = joi_1.default.object({
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    name: joi_1.default.string().trim().required().messages({
        'string.empty': 'Plan name is required',
    }),
    description: joi_1.default.string().trim().optional(),
    subscriptionType: joi_1.default.string().valid('Free', 'Monthly', 'Yearly', 'Lifetime').required(),
    price: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().trim().optional().default('USD'),
    features: joi_1.default.array().items(joi_1.default.string().trim()).required(),
    maxStudents: joi_1.default.number().integer().min(1).required(),
    maxTeachers: joi_1.default.number().integer().min(1).required(),
    maxCourses: joi_1.default.number().integer().min(1).required(),
    status: joi_1.default.string().valid('Active', 'Inactive').optional(),
});
/**
 * Joi validation schema for updating an existing Subscription Plan.
 */
exports.updateSubscriptionPlanSchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    subscriptionType: joi_1.default.string().valid('Free', 'Monthly', 'Yearly', 'Lifetime').optional(),
    price: joi_1.default.number().min(0).optional(),
    currency: joi_1.default.string().trim().optional(),
    features: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    maxStudents: joi_1.default.number().integer().min(1).optional(),
    maxTeachers: joi_1.default.number().integer().min(1).optional(),
    maxCourses: joi_1.default.number().integer().min(1).optional(),
    status: joi_1.default.string().valid('Active', 'Inactive').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createSubscriptionPlanSchema;
