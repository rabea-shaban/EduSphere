import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Announcement.
 */
export const createAnnouncementSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
  }),
  content: Joi.string().trim().required().messages({
    'string.empty': 'Content is required',
  }),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  teacherId: Joi.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
  targetAudience: Joi.string().valid('All', 'Grade', 'Course', 'Specific Students').required(),
  targetIds: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional().default([]),
  publishAt: Joi.date().iso().optional(),
  expireAt: Joi.date().iso().min(Joi.ref('publishAt')).optional(),
  isPublished: Joi.boolean().optional(),
});

/**
 * Joi validation schema for updating an existing Announcement.
 */
export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  targetAudience: Joi.string().valid('All', 'Grade', 'Course', 'Specific Students').optional(),
  targetIds: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional(),
  publishAt: Joi.date().iso().optional(),
  expireAt: Joi.date().iso().min(Joi.ref('publishAt')).optional(),
  isPublished: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
