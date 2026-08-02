"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLiveSessionSchema = exports.createLiveSessionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for scheduling a Live Session.
 */
exports.createLiveSessionSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required(),
    teacherId: joi_1.default.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
    provider: joi_1.default.string().valid('Google Meet', 'Zoom', 'Microsoft Teams', 'Custom').required(),
    meetingUrl: joi_1.default.string().uri().required().messages({
        'string.uri': 'Invalid meeting URL format',
        'any.required': 'Meeting URL is required',
    }),
    meetingId: joi_1.default.string().trim().optional(),
    meetingPassword: joi_1.default.string().trim().optional(),
    startTime: joi_1.default.date().iso().required(),
    endTime: joi_1.default.date().iso().min(joi_1.default.ref('startTime')).required().messages({
        'date.min': 'End time must be after start time',
    }),
    status: joi_1.default.string().valid('Scheduled', 'Live', 'Completed', 'Cancelled').optional(),
    recordingUrl: joi_1.default.string().uri().optional(),
});
/**
 * Joi validation schema for updating an existing Live Session.
 */
exports.updateLiveSessionSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    provider: joi_1.default.string().valid('Google Meet', 'Zoom', 'Microsoft Teams', 'Custom').optional(),
    meetingUrl: joi_1.default.string().uri().optional(),
    meetingId: joi_1.default.string().trim().optional(),
    meetingPassword: joi_1.default.string().trim().optional(),
    startTime: joi_1.default.date().iso().optional(),
    endTime: joi_1.default.date().iso().min(joi_1.default.ref('startTime')).optional().messages({
        'date.min': 'End time must be after start time',
    }),
    status: joi_1.default.string().valid('Scheduled', 'Live', 'Completed', 'Cancelled').optional(),
    recordingUrl: joi_1.default.string().uri().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createLiveSessionSchema;
