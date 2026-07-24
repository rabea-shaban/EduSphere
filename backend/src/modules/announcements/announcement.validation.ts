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
  createdBy: Joi.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
  targetType: Joi.string()
    .valid('All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade')
    .required(),
  targetIds: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional().default([]),
  publishDate: Joi.date().iso().optional(),
  expireDate: Joi.date().iso().min(Joi.ref('publishDate')).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
});

/**
 * Joi validation schema for updating an existing Announcement.
 */
export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim().optional(),
  content: Joi.string().trim().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  targetType: Joi.string()
    .valid('All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade')
    .optional(),
  targetIds: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional(),
  publishDate: Joi.date().iso().optional(),
  expireDate: Joi.date().iso().min(Joi.ref('publishDate')).optional(),
  status: Joi.string().valid('Draft', 'Published', 'Archived').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
