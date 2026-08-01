import Joi from 'joi';

/**
 * Joi validation schema for user registration.
 */
export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
  }),
  username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
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
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  dateOfBirth: Joi.date().iso().max('now').optional(),
  role: Joi.string()
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
export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().trim().required().messages({
    'string.empty': 'Email or username is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

/**
 * Joi validation schema for forgot password request.
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email address is required',
    'string.email': 'Please enter a valid email address',
  }),
});

/**
 * Joi validation schema for resetting password.
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    'string.empty': 'Reset token is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

/**
 * Joi validation schema for email verification.
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    'string.empty': 'Verification token is required',
  }),
});

/**
 * Joi validation schema for profile updates.
 */
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional().allow('', null),
  lastName: Joi.string().trim().min(2).max(50).optional().allow('', null),
  phone: Joi.string().trim().min(6).max(20).optional().allow('', null),
  gender: Joi.string().optional().allow('', null),
  dateOfBirth: Joi.any().optional(),
  avatar: Joi.string().optional().allow('', null),
  stage: Joi.string().optional().allow('', null),
  grade: Joi.string().optional().allow('', null),
  system: Joi.string().optional().allow('', null),
  stream: Joi.string().optional().allow('', null),
  bio: Joi.string().optional().allow('', null),
  governorate: Joi.string().optional().allow('', null),
  nationalId: Joi.string().optional().allow('', null),
})
  .min(1)
  .unknown(true)
  .messages({
    'object.min': 'At least one field must be updated',
  });

/**
 * Joi validation schema for changing password.
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
  }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password must match the new password',
      'any.required': 'Confirm password is required',
    }),
});

/**
 * Joi validation schema for avatar updates.
 */
export const updateAvatarSchema = Joi.object({
  avatar: Joi.string().trim().required().messages({
    'string.empty': 'Avatar image string or URL is required',
  }),
});
