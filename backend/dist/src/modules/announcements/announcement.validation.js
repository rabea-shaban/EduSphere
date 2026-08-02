"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Announcement.
 */
exports.createAnnouncementSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Title is required',
    }),
    content: joi_1.default.string().trim().required().messages({
        'string.empty': 'Content is required',
    }),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    createdBy: joi_1.default.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
    targetType: joi_1.default.string()
        .valid('All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade')
        .required(),
    targetIds: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern)).optional().default([]),
    publishDate: joi_1.default.date().iso().optional(),
    expireDate: joi_1.default.date().iso().min(joi_1.default.ref('publishDate')).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
});
/**
 * Joi validation schema for updating an existing Announcement.
 */
exports.updateAnnouncementSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    content: joi_1.default.string().trim().optional(),
    organizationId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    targetType: joi_1.default.string()
        .valid('All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade')
        .optional(),
    targetIds: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern)).optional(),
    publishDate: joi_1.default.date().iso().optional(),
    expireDate: joi_1.default.date().iso().min(joi_1.default.ref('publishDate')).optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Archived').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
