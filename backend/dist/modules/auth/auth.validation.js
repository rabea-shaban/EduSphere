"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatarSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Joi validation schema for user registration.
 */
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.empty': 'First name is required',
    }),
    lastName: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Last name is required',
    }),
    username: joi_1.default.string().trim().alphanum().min(3).max(30).required().messages({
        'string.empty': 'Username is required',
    }),
    email: joi_1.default.string().trim().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address',
    }),
    phone: joi_1.default.string().trim().min(6).max(20).required().messages({
        'string.empty': 'Phone number is required',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    dateOfBirth: joi_1.default.date().iso().max('now').optional(),
    role: joi_1.default.string()
        .valid('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
        .required()
        .messages({
        'any.only': 'Role must be one of ADMIN, TEACHER, STUDENT, or PARENT (SUPER_ADMIN cannot be registered)',
        'string.empty': 'Role is required',
    }),
});
/**
 * Joi validation schema for user login.
 */
exports.loginSchema = joi_1.default.object({
    emailOrUsername: joi_1.default.string().trim().required().messages({
        'string.empty': 'Email or username is required',
    }),
    password: joi_1.default.string().required().messages({
        'string.empty': 'Password is required',
    }),
});
/**
 * Joi validation schema for forgot password request.
 */
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required().messages({
        'string.empty': 'Email address is required',
        'string.email': 'Please enter a valid email address',
    }),
});
/**
 * Joi validation schema for resetting password.
 */
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().trim().required().messages({
        'string.empty': 'Reset token is required',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
});
/**
 * Joi validation schema for email verification.
 */
exports.verifyEmailSchema = joi_1.default.object({
    token: joi_1.default.string().trim().required().messages({
        'string.empty': 'Verification token is required',
    }),
});
/**
 * Joi validation schema for profile updates.
 */
exports.updateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(2).max(50).optional(),
    lastName: joi_1.default.string().trim().min(2).max(50).optional(),
    phone: joi_1.default.string().trim().min(6).max(20).optional(),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    dateOfBirth: joi_1.default.date().iso().max('now').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
/**
 * Joi validation schema for changing password.
 */
exports.changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        'string.empty': 'Current password is required',
    }),
    newPassword: joi_1.default.string().min(6).required().messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 6 characters long',
    }),
    confirmPassword: joi_1.default.any()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'Confirm password must match the new password',
        'any.required': 'Confirm password is required',
    }),
});
/**
 * Joi validation schema for avatar updates.
 */
exports.updateAvatarSchema = joi_1.default.object({
    avatar: joi_1.default.string().trim().uri().required().messages({
        'string.empty': 'Avatar URL is required',
        'string.uri': 'Please provide a valid URL for the avatar image',
    }),
});
