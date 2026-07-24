import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createSettingsSchema = Joi.object({
  organizationName: Joi.string().trim().required(),
  logo: Joi.string().trim().optional(),
  favicon: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  defaultLanguage: Joi.string().trim().optional().default('en'),
  timezone: Joi.string().trim().optional().default('UTC'),
  currency: Joi.string().trim().optional().default('USD'),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateSettingsSchema = Joi.object({
  organizationName: Joi.string().trim().optional(),
  logo: Joi.string().trim().optional(),
  favicon: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  defaultLanguage: Joi.string().trim().optional(),
  timezone: Joi.string().trim().optional(),
  currency: Joi.string().trim().optional(),
}).min(1);
