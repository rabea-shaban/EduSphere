"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnrollmentSchema = exports.enrollStudentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for student enrollment request.
 */
exports.enrollStudentSchema = joi_1.default.object({
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid course ID format',
        'any.required': 'Course ID is required',
    }),
    paymentStatus: joi_1.default.string().valid('Paid', 'Unpaid', 'Free').optional(),
});
/**
 * Joi validation schema for updating an existing Enrollment.
 */
exports.updateEnrollmentSchema = joi_1.default.object({
    status: joi_1.default.string().valid('Pending', 'Active', 'Completed', 'Cancelled').optional(),
    paymentStatus: joi_1.default.string().valid('Paid', 'Unpaid', 'Free').optional(),
    purchasePrice: joi_1.default.number().min(0).optional(),
    certificateIssued: joi_1.default.boolean().optional(),
    completedAt: joi_1.default.date().iso().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
