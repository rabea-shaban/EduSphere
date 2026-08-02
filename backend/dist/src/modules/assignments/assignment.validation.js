"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const submissionTypeValues = [
    'TextSubmission',
    'FileUpload',
    'PDFUpload',
    'ImageUpload',
    'ZIPUpload',
    'ExternalUrl',
    'MultipleAttachments',
];
exports.createAssignmentSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required().messages({
        'string.empty': 'Assignment title is required',
        'any.required': 'Assignment title is required',
    }),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    instructions: joi_1.default.string().trim().max(3000).optional().allow('', null),
    courseId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.empty': 'Course reference is required',
        'any.required': 'Course reference is required',
    }),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.empty': 'Lesson reference is required',
        'any.required': 'Lesson reference is required',
    }),
    teacherId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    attachments: joi_1.default.array().items(joi_1.default.any()).optional(),
    totalMarks: joi_1.default.number().min(0).optional().default(100),
    passingMarks: joi_1.default.number().min(0).optional().default(60),
    submissionType: joi_1.default.string()
        .valid(...submissionTypeValues)
        .optional()
        .default('FileUpload'),
    allowedFileTypes: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    maxFileSizeMB: joi_1.default.number().min(1).optional().default(10),
    maxFiles: joi_1.default.number().min(1).optional().default(5),
    maxAttempts: joi_1.default.number().min(0).optional().default(1),
    allowLateSubmission: joi_1.default.boolean().optional().default(false),
    latePenaltyPercentage: joi_1.default.number().min(0).max(100).optional().default(0),
    startDate: joi_1.default.date().iso().optional().allow(null),
    dueDate: joi_1.default.date().iso().required().messages({
        'any.required': 'Due date is required',
    }),
    expiryDate: joi_1.default.date().iso().optional().allow(null),
    visibility: joi_1.default.string().valid('Public', 'Private', 'Enrolled').optional().default('Enrolled'),
    status: joi_1.default.string().valid('Draft', 'Published', 'Closed', 'Archived').optional().default('Published'),
    estimatedDuration: joi_1.default.number().min(0).optional().default(60),
});
exports.updateAssignmentSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).optional(),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    instructions: joi_1.default.string().trim().max(3000).optional().allow('', null),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional().allow('', null),
    lessonId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    teacherId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    attachments: joi_1.default.array().items(joi_1.default.any()).optional(),
    totalMarks: joi_1.default.number().min(0).optional(),
    passingMarks: joi_1.default.number().min(0).optional(),
    submissionType: joi_1.default.string().valid(...submissionTypeValues).optional(),
    allowedFileTypes: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    maxFileSizeMB: joi_1.default.number().min(1).optional(),
    maxFiles: joi_1.default.number().min(1).optional(),
    maxAttempts: joi_1.default.number().min(0).optional(),
    allowLateSubmission: joi_1.default.boolean().optional(),
    latePenaltyPercentage: joi_1.default.number().min(0).max(100).optional(),
    startDate: joi_1.default.date().iso().optional().allow(null),
    dueDate: joi_1.default.date().iso().optional(),
    expiryDate: joi_1.default.date().iso().optional().allow(null),
    visibility: joi_1.default.string().valid('Public', 'Private', 'Enrolled').optional(),
    status: joi_1.default.string().valid('Draft', 'Published', 'Closed', 'Archived').optional(),
    estimatedDuration: joi_1.default.number().min(0).optional(),
}).min(1);
exports.default = {
    createAssignmentSchema: exports.createAssignmentSchema,
    updateAssignmentSchema: exports.updateAssignmentSchema,
};
