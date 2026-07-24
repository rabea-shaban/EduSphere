import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createMenuSchema = Joi.object({
  title: Joi.string().trim().required(),
  url: Joi.string().trim().required(),
  parentId: Joi.string().pattern(mongoIdPattern).optional(),
  displayOrder: Joi.number().integer().optional(),
  target: Joi.string().valid('_self', '_blank').optional(),
  isActive: Joi.boolean().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateMenuSchema = Joi.object({
  title: Joi.string().trim().optional(),
  url: Joi.string().trim().optional(),
  parentId: Joi.string().pattern(mongoIdPattern).optional(),
  displayOrder: Joi.number().integer().optional(),
  target: Joi.string().valid('_self', '_blank').optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
