import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createBannerSchema = Joi.object({
  title: Joi.string().trim().required(),
  subtitle: Joi.string().trim().optional(),
  image: Joi.string().trim().required(),
  buttonText: Joi.string().trim().optional(),
  buttonLink: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateBannerSchema = Joi.object({
  title: Joi.string().trim().optional(),
  subtitle: Joi.string().trim().optional(),
  image: Joi.string().trim().optional(),
  buttonText: Joi.string().trim().optional(),
  buttonLink: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
