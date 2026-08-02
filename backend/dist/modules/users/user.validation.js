"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi Validation schema for creating a new user.
 */
exports.createUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters long',
    }),
    lastName: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters long',
    }),
    username: joi_1.default.string().trim().alphanum().min(3).max(30).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
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
    avatar: joi_1.default.string().trim().uri().optional(),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    dateOfBirth: joi_1.default.date().iso().max('now').optional(),
    role: joi_1.default.string().valid('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT').required().messages({
        'any.only': 'Role must be one of SUPER_ADMIN, ADMIN, TEACHER, STUDENT, or PARENT',
        'string.empty': 'Role is required',
    }),
    isVerified: joi_1.default.boolean().optional(),
    isBlocked: joi_1.default.boolean().optional(),
});
/**
 * Joi Validation schema for updating an existing user.
 */
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().min(2).max(50).optional(),
    lastName: joi_1.default.string().trim().min(2).max(50).optional(),
    username: joi_1.default.string().trim().alphanum().min(3).max(30).optional(),
    email: joi_1.default.string().trim().email().optional(),
    phone: joi_1.default.string().trim().min(6).max(20).optional(),
    password: joi_1.default.string().min(6).optional(),
    avatar: joi_1.default.string().trim().uri().optional(),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    dateOfBirth: joi_1.default.date().iso().max('now').optional(),
    role: joi_1.default.string().valid('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT').optional(),
    isVerified: joi_1.default.boolean().optional(),
    isBlocked: joi_1.default.boolean().optional(),
}).min(1).messages({
    'object.min': 'At least one field must be updated',
});
/**
 * Joi Validation schema for validating Mongo ID route parameters.
 */
exports.userIdSchema = joi_1.default.object({
    id: joi_1.default.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid user ID format. Must be a 24-character hex string.',
        'string.empty': 'User ID is required',
    }),
});
