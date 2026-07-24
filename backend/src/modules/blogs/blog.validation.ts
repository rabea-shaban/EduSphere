import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createBlogSchema = Joi.object({
  title: Joi.string().trim().required(),
  slug: Joi.string().trim().lowercase().optional(),
  excerpt: Joi.string().trim().optional(),
  content: Joi.string().trim().required(),
  thumbnail: Joi.string().trim().optional(),
  authorId: Joi.string().pattern(mongoIdPattern).optional(),
  categoryId: Joi.string().pattern(mongoIdPattern).required(),
  tags: Joi.array().items(Joi.string().trim()).optional().default([]),
  status: Joi.string().valid('Draft', 'Published').optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().trim().optional(),
  slug: Joi.string().trim().lowercase().optional(),
  excerpt: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),
  thumbnail: Joi.string().trim().optional(),
  categoryId: Joi.string().pattern(mongoIdPattern).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string().valid('Draft', 'Published').optional(),
}).min(1);
