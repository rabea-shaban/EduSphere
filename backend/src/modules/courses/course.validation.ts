import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Course.
 */
export const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Course title is required',
    'string.min': 'Course title must be at least 3 characters',
  }),
  description: Joi.string().trim().optional(),
  thumbnail: Joi.string().trim().uri().optional(),
  previewVideo: Joi.string().trim().uri().optional(),
  teacher: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid teacher ID format',
    'any.required': 'Teacher is required',
  }),
  academicYear: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid academic year ID format',
    'any.required': 'Academic year is required',
  }),
  grade: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid grade ID format',
    'any.required': 'Grade is required',
  }),
  subject: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid subject ID format',
    'any.required': 'Subject is required',
  }),
  term: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid term ID format',
    'any.required': 'Term is required',
  }),
  language: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).max(Joi.ref('price')).optional().messages({
    'number.max': 'Discount price must be less than or equal to original price',
  }),
  duration: Joi.number().min(0).optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  requirements: Joi.array().items(Joi.string().trim()).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  isFeatured: Joi.boolean().optional(),
  isFree: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Course.
 */
export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().trim().optional(),
  thumbnail: Joi.string().trim().uri().optional(),
  previewVideo: Joi.string().trim().uri().optional(),
  teacher: Joi.string().pattern(mongoIdPattern).optional(),
  academicYear: Joi.string().pattern(mongoIdPattern).optional(),
  grade: Joi.string().pattern(mongoIdPattern).optional(),
  subject: Joi.string().pattern(mongoIdPattern).optional(),
  term: Joi.string().pattern(mongoIdPattern).optional(),
  language: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).max(Joi.ref('price')).optional().messages({
    'number.max': 'Discount price must be less than or equal to original price',
  }),
  duration: Joi.number().min(0).optional(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  requirements: Joi.array().items(Joi.string().trim()).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  isFeatured: Joi.boolean().optional(),
  isFree: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
