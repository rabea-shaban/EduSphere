import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createFaqSchema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  displayOrder: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateFaqSchema = Joi.object({
  question: Joi.string().trim().optional(),
  answer: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
