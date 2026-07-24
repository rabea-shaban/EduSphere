import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a Category.
 */
export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Category name is required',
  }),
  slug: Joi.string().trim().lowercase().required().messages({
    'string.empty': 'Slug is required',
  }),
  description: Joi.string().trim().optional(),
  type: Joi.string().valid('Blog', 'Course', 'General').optional().default('General'),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

/**
 * Joi validation schema for updating an existing Category.
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
  slug: Joi.string().trim().lowercase().optional(),
  description: Joi.string().trim().optional(),
  type: Joi.string().valid('Blog', 'Course', 'General').optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createCategorySchema;
