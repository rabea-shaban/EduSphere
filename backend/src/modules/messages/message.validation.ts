import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for sending a private/group Message.
 * - message can be empty string if attachments are provided
 * - messageType is auto-detected if not provided
 */
export const sendMessageSchema = Joi.object({
  conversationId: Joi.string().pattern(mongoIdPattern).required().messages({
    'any.required': 'Conversation ID is required',
    'string.pattern.base': 'Invalid conversation ID format',
  }),
  clientMessageId: Joi.string().optional(),
  message: Joi.string().allow('').trim().default('').optional(),
  messageType: Joi.string()
    .valid('Text', 'Image', 'Video', 'Audio', 'Document', 'System')
    .optional()
    .default('Text'),
  attachments: Joi.array().items(Joi.string().trim()).optional().default([]),
  replyTo: Joi.string().pattern(mongoIdPattern).optional(),
}).custom((value, helpers) => {
  // Must have either a non-empty message or at least one attachment
  const hasText = value.message && value.message.trim().length > 0;
  const hasAttachments = value.attachments && value.attachments.length > 0;
  if (!hasText && !hasAttachments) {
    return helpers.error('any.invalid');
  }
  return value;
}).messages({
  'any.invalid': 'Message must have either text or at least one attachment',
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
