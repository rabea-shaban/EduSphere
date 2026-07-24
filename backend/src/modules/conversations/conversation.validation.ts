import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a Conversation (Private/Group/Support).
 */
export const createConversationSchema = Joi.object({
  participants: Joi.array()
    .items(Joi.string().pattern(mongoIdPattern))
    .min(1)
    .required()
    .messages({
      'array.min': 'A conversation must have at least one other participant',
      'any.required': 'Participants are required',
    }),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  conversationType: Joi.string().valid('Private', 'Group', 'Support').optional().default('Private'),
});

export default createConversationSchema;
