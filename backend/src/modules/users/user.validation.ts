import Joi from 'joi';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi Validation schema for creating a new user.
 */
export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters long',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters long',
  }),
  username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  phone: Joi.string().trim().min(6).max(20).required().messages({
    'string.empty': 'Phone number is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
  avatar: Joi.string().trim().uri().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  dateOfBirth: Joi.date().iso().max('now').optional(),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT').required().messages({
    'any.only': 'Role must be one of SUPER_ADMIN, ADMIN, TEACHER, STUDENT, or PARENT',
    'string.empty': 'Role is required',
  }),
  isVerified: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional(),
});

/**
 * Joi Validation schema for updating an existing user.
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(2).max(50).optional(),
  username: Joi.string().trim().alphanum().min(3).max(30).optional(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.string().trim().min(6).max(20).optional(),
  password: Joi.string().min(6).optional(),
  avatar: Joi.string().trim().uri().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  dateOfBirth: Joi.date().iso().max('now').optional(),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT').optional(),
  isVerified: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be updated',
});

/**
 * Joi Validation schema for validating Mongo ID route parameters.
 */
export const userIdSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid user ID format. Must be a 24-character hex string.',
    'string.empty': 'User ID is required',
  }),
});
