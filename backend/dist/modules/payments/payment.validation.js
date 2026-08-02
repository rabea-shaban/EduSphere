"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.purchaseSubscriptionSchema = exports.purchaseCourseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for purchasing a Course.
 */
exports.purchaseCourseSchema = joi_1.default.object({
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    couponCode: joi_1.default.string().trim().uppercase().optional(),
});
/**
 * Joi validation schema for purchasing a Subscription.
 */
exports.purchaseSubscriptionSchema = joi_1.default.object({
    subscriptionId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid subscription plan ID format',
        'any.required': 'Subscription plan ID is required',
    }),
    couponCode: joi_1.default.string().trim().uppercase().optional(),
});
/**
 * Joi validation schema for verifying manual payments (admins only).
 */
exports.verifyPaymentSchema = joi_1.default.object({
    paymentId: joi_1.default.string().pattern(mongoIdPattern).required(),
    status: joi_1.default.string().valid('Paid', 'Failed').required(),
    paymentReference: joi_1.default.string().trim().required(),
    paidAt: joi_1.default.date().iso().optional(),
});
