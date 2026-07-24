import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const updateSocialLinksSchema = Joi.object({
  facebook: Joi.string().trim().uri().allow('').optional(),
  instagram: Joi.string().trim().uri().allow('').optional(),
  linkedin: Joi.string().trim().uri().allow('').optional(),
  youtube: Joi.string().trim().uri().allow('').optional(),
  x: Joi.string().trim().uri().allow('').optional(),
  tiktok: Joi.string().trim().uri().allow('').optional(),
  website: Joi.string().trim().uri().allow('').optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
}).min(1);
