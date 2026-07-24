import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createSeoSchema = Joi.object({
  page: Joi.string().trim().required(),
  metaTitle: Joi.string().trim().required(),
  metaDescription: Joi.string().trim().required(),
  keywords: Joi.array().items(Joi.string().trim()).optional().default([]),
  canonicalUrl: Joi.string().trim().uri().optional(),
  ogImage: Joi.string().trim().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateSeoSchema = Joi.object({
  page: Joi.string().trim().optional(),
  metaTitle: Joi.string().trim().optional(),
  metaDescription: Joi.string().trim().optional(),
  keywords: Joi.array().items(Joi.string().trim()).optional(),
  canonicalUrl: Joi.string().trim().uri().optional(),
  ogImage: Joi.string().trim().optional(),
}).min(1);
