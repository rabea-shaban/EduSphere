import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const createTestimonialSchema = Joi.object({
  studentName: Joi.string().trim().required(),
  studentImage: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().required(),
  isApproved: Joi.boolean().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
});

export const updateTestimonialSchema = Joi.object({
  studentName: Joi.string().trim().optional(),
  studentImage: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().trim().optional(),
  isApproved: Joi.boolean().optional(),
}).min(1);
