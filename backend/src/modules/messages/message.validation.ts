import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for sending a private/group Message.
 */
export const sendMessageSchema = Joi.object({
  conversationId: Joi.string().pattern(mongoIdPattern).required().messages({
    'any.required': 'Conversation ID is required',
  }),
  message: Joi.string().trim().required().messages({
    'string.empty': 'Message content is required',
  }),
  messageType: Joi.string().valid('Text', 'Image', 'Video', 'Audio', 'Document', 'System').optional().default('Text'),
  attachments: Joi.array().items(Joi.string().trim()).optional().default([]),
  replyTo: Joi.string().pattern(mongoIdPattern).optional(),
});

/**
 * Joi validation schema for editing a message.
 */
export const editMessageSchema = Joi.object({
  message: Joi.string().trim().required().messages({
    'string.empty': 'Message content is required',
  }),
});
export default sendMessageSchema;
