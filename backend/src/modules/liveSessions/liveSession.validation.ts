import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for scheduling a Live Session.
 */
export const createLiveSessionSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
  }),
  description: Joi.string().trim().optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  courseId: Joi.string().pattern(mongoIdPattern).required(),
  teacherId: Joi.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
  provider: Joi.string().valid('Google Meet', 'Zoom', 'Microsoft Teams', 'Custom').required(),
  meetingUrl: Joi.string().uri().required().messages({
    'string.uri': 'Invalid meeting URL format',
    'any.required': 'Meeting URL is required',
  }),
  meetingId: Joi.string().trim().optional(),
  meetingPassword: Joi.string().trim().optional(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).required().messages({
    'date.min': 'End time must be after start time',
  }),
  status: Joi.string().valid('Scheduled', 'Live', 'Completed', 'Cancelled').optional(),
  recordingUrl: Joi.string().uri().optional(),
});

/**
 * Joi validation schema for updating an existing Live Session.
 */
export const updateLiveSessionSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  provider: Joi.string().valid('Google Meet', 'Zoom', 'Microsoft Teams', 'Custom').optional(),
  meetingUrl: Joi.string().uri().optional(),
  meetingId: Joi.string().trim().optional(),
  meetingPassword: Joi.string().trim().optional(),
  startTime: Joi.date().iso().optional(),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).optional().messages({
    'date.min': 'End time must be after start time',
  }),
  status: Joi.string().valid('Scheduled', 'Live', 'Completed', 'Cancelled').optional(),
  recordingUrl: Joi.string().uri().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createLiveSessionSchema;
