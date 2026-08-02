"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a Conversation (Private/Group/Support).
 */
exports.createConversationSchema = joi_1.default.object({
    participants: joi_1.default.array()
        .items(joi_1.default.string().pattern(mongoIdPattern))
        .min(1)
        .required()
        .messages({
        'array.min': 'A conversation must have at least one other participant',
        'any.required': 'Participants are required',
    }),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    conversationType: joi_1.default.string().valid('Private', 'Group', 'Support').optional().default('Private'),
});
exports.default = exports.createConversationSchema;
