import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a notification.
 */
export const createNotificationSchema = Joi.object({
  recipientId: Joi.string().pattern(mongoIdPattern).required(),
  senderId: Joi.string().pattern(mongoIdPattern).optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  title: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  type: Joi.string()
    .valid('Course', 'Assignment', 'Quiz', 'Exam', 'Payment', 'Announcement', 'System', 'Chat')
    .required(),
  deliveryChannel: Joi.string().valid('InApp', 'Push', 'Email').optional(),
});

/**
 * Joi validation schema for updating a notification.
 */
export const updateNotificationSchema = Joi.object({
  isRead: Joi.boolean().required(),
});
