"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for creating a new Assignment.
 */
exports.createAssignmentSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        'string.empty': 'Assignment title is required',
    }),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).required(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).required(),
    teacherId: joi_1.default.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    instructions: joi_1.default.string().trim().optional(),
    totalMarks: joi_1.default.number().min(0).required(),
    passingMarks: joi_1.default.number().min(0).max(joi_1.default.ref('totalMarks')).required().messages({
        'number.max': 'Passing marks must be less than or equal to total marks',
    }),
    allowLateSubmission: joi_1.default.boolean().optional(),
    startDate: joi_1.default.date().iso().optional(),
    dueDate: joi_1.default.date().iso().required().messages({
        'any.required': 'Due date is required',
    }),
    status: joi_1.default.string().valid('Draft', 'Published', 'Closed').optional(),
});
/**
 * Joi validation schema for updating an existing Assignment.
 */
exports.updateAssignmentSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().trim().optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    instructions: joi_1.default.string().trim().optional(),
    totalMarks: joi_1.default.number().min(0).optional(),
    passingMarks: joi_1.default.number().min(0).max(joi_1.default.ref('totalMarks')).optional().messages({
        'number.max': 'Passing marks must be less than or equal to total marks',
    }),
    allowLateSubmission: joi_1.default.boolean().optional(),
    startDate: joi_1.default.date().iso().optional(),
    dueDate: joi_1.default.date().iso().optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Closed').optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
exports.default = exports.createAssignmentSchema;
