import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().optional(),
  subject: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  status: Joi.string().valid('New', 'In Progress', 'Closed').optional(),
});

export const updateContactSchema = Joi.object({
  status: Joi.string().valid('New', 'In Progress', 'Closed').required(),
});
