"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMessageSchema = exports.sendMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for sending a private/group Message.
 * - message can be empty string if attachments are provided
 * - messageType is auto-detected if not provided
 */
exports.sendMessageSchema = joi_1.default.object({
    conversationId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'any.required': 'Conversation ID is required',
        'string.pattern.base': 'Invalid conversation ID format',
    }),
    clientMessageId: joi_1.default.string().optional(),
    message: joi_1.default.string().allow('').trim().default('').optional(),
    messageType: joi_1.default.string()
        .valid('Text', 'Image', 'Video', 'Audio', 'Document', 'System')
        .optional()
        .default('Text'),
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional().default([]),
    replyTo: joi_1.default.string().pattern(mongoIdPattern).optional(),
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
exports.editMessageSchema = joi_1.default.object({
    message: joi_1.default.string().trim().required().messages({
        'string.empty': 'Message content is required',
    }),
});
exports.default = exports.sendMessageSchema;
