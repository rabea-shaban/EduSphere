import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for sending a private Message.
 */
export const sendMessageSchema = Joi.object({
  receiverId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid receiver ID format',
    'any.required': 'Receiver ID is required',
  }),
  message: Joi.string().trim().required().messages({
    'string.empty': 'Message content is required',
  }),
  attachments: Joi.array().items(Joi.string().trim()).optional().default([]),
  messageType: Joi.string().valid('Text', 'Image', 'File', 'System').optional(),
});
export default sendMessageSchema;
