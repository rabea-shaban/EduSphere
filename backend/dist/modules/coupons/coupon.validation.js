"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCouponSchema = exports.updateCouponSchema = exports.createCouponSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for creating a Coupon.
 */
exports.createCouponSchema = joi_1.default.object({
    code: joi_1.default.string().trim().uppercase().required().messages({
        'string.empty': 'Coupon code is required',
    }),
    description: joi_1.default.string().trim().optional(),
    discountType: joi_1.default.string().valid('Percentage', 'Fixed').required(),
    discountValue: joi_1.default.number().min(0).required(),
    maximumDiscount: joi_1.default.number().min(0).optional(),
    minimumPurchase: joi_1.default.number().min(0).optional().default(0),
    usageLimit: joi_1.default.number().integer().min(1).optional(),
    expiresAt: joi_1.default.date().iso().required(),
    status: joi_1.default.string().valid('Active', 'Inactive').optional(),
});
/**
 * Joi validation schema for updating an existing Coupon.
 */
exports.updateCouponSchema = joi_1.default.object({
    code: joi_1.default.string().trim().uppercase().optional(),
    description: joi_1.default.string().trim().optional(),
    discountType: joi_1.default.string().valid('Percentage', 'Fixed').optional(),
    discountValue: joi_1.default.number().min(0).optional(),
    maximumDiscount: joi_1.default.number().min(0).optional(),
    minimumPurchase: joi_1.default.number().min(0).optional(),
    usageLimit: joi_1.default.number().integer().min(1).optional(),
    expiresAt: joi_1.default.date().iso().optional(),
    status: joi_1.default.string().valid('Active', 'Inactive').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
/**
 * Joi validation schema for verifying a Coupon against purchase details.
 */
exports.validateCouponSchema = joi_1.default.object({
    code: joi_1.default.string().trim().uppercase().required(),
    purchaseAmount: joi_1.default.number().min(0).required(),
});
exports.default = exports.createCouponSchema;
