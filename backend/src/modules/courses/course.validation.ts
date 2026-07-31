import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Course.
 */
export const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(2).max(300).required().messages({
    'string.empty': 'Course title is required',
    'string.min': 'Course title must be at least 2 characters',
  }),
  description: Joi.string().trim().optional().allow('', null),
  thumbnail: Joi.string().trim().optional().allow('', null),
  thumbnailUrl: Joi.string().trim().optional().allow('', null),
  category: Joi.string().trim().optional().allow('', null),
  previewVideo: Joi.string().trim().optional().allow('', null),
  teacher: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  academicYear: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  grade: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  subject: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  term: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  language: Joi.string().trim().optional().allow('', null),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  level: Joi.string().optional().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  requirements: Joi.array().items(Joi.string().trim()).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  isFeatured: Joi.boolean().optional(),
  isFree: Joi.boolean().optional(),
}).unknown(true);

/**
 * Joi validation schema for updating an existing Course.
 */
export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(2).max(300).optional(),
  description: Joi.string().trim().optional().allow('', null),
  thumbnail: Joi.string().trim().optional().allow('', null),
  thumbnailUrl: Joi.string().trim().optional().allow('', null),
  category: Joi.string().trim().optional().allow('', null),
  previewVideo: Joi.string().trim().optional().allow('', null),
  teacher: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  academicYear: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  grade: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  subject: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  term: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  language: Joi.string().trim().optional().allow('', null),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  level: Joi.string().optional().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  requirements: Joi.array().items(Joi.string().trim()).optional(),
  objectives: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
  isFeatured: Joi.boolean().optional(),
  isFree: Joi.boolean().optional(),
})
  .unknown(true)
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
