import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createPageSchema = Joi.object({
  title: Joi.string().trim().required(),
  slug: Joi.string().trim().lowercase().optional(),
  content: Joi.string().trim().required(),
  pageType: Joi.string().valid('Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom').optional(),
  status: Joi.string().valid('Draft', 'Published').optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updatePageSchema = Joi.object({
  title: Joi.string().trim().optional(),
  slug: Joi.string().trim().lowercase().optional(),
  content: Joi.string().trim().optional(),
  pageType: Joi.string().valid('Home', 'About', 'Contact', 'Privacy Policy', 'Terms', 'Custom').optional(),
  status: Joi.string().valid('Draft', 'Published').optional(),
}).min(1);
