"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSchema = exports.createNotificationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a notification.
 */
exports.createNotificationSchema = joi_1.default.object({
    recipientId: joi_1.default.string().pattern(mongoIdPattern).required(),
    senderId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    title: joi_1.default.string().trim().required(),
    message: joi_1.default.string().trim().required(),
    type: joi_1.default.string()
        .valid('Course', 'Lesson', 'Assignment', 'Quiz', 'Exam', 'Payment', 'Announcement', 'System', 'Chat')
        .required(),
    priority: joi_1.default.string().valid('Low', 'Medium', 'High').optional().default('Medium'),
    deliveryChannel: joi_1.default.array()
        .items(joi_1.default.string().valid('InApp', 'Push', 'Email', 'SMS'))
        .optional()
        .default(['InApp']),
});
/**
 * Joi validation schema for updating a notification.
 */
exports.updateNotificationSchema = joi_1.default.object({
    isRead: joi_1.default.boolean().required(),
});
