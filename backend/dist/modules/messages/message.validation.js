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
 */
exports.sendMessageSchema = joi_1.default.object({
    conversationId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'any.required': 'Conversation ID is required',
    }),
    message: joi_1.default.string().trim().required().messages({
        'string.empty': 'Message content is required',
    }),
    messageType: joi_1.default.string().valid('Text', 'Image', 'Video', 'Audio', 'Document', 'System').optional().default('Text'),
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional().default([]),
    replyTo: joi_1.default.string().pattern(mongoIdPattern).optional(),
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
