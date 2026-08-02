"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveLessonSchema = exports.reorderLessonsSchema = exports.updateLessonSchema = exports.createLessonSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const lessonTypeValues = [
    'Video',
    'Article',
    'Live',
    'PDF',
    'Resource',
    'Interactive',
    'Quiz',
    'Assignment',
    'Text',
];
const statusValues = ['Draft', 'Published', 'Scheduled', 'Hidden', 'Archived'];
const visibilityValues = ['Public', 'Private', 'Enrolled'];
const completionRequirementValues = ['Watch75', 'Watch100', 'PassQuiz', 'SubmitAssignment', 'Manual'];
/**
 * Joi schema for creating a new Lesson.
 */
exports.createLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).required().messages({
        'string.empty': 'Lesson title is required',
        'string.min': 'Lesson title must be at least 2 characters',
        'any.required': 'Lesson title is required',
    }),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    shortDescription: joi_1.default.string().trim().max(500).optional().allow('', null),
    content: joi_1.default.string().trim().optional().allow('', null),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional().messages({
        'string.pattern.base': 'Invalid section ID format',
    }),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional().messages({
        'string.pattern.base': 'Invalid unit ID format',
    }),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional().messages({
        'string.pattern.base': 'Invalid course ID format',
    }),
    lessonType: joi_1.default.string()
        .valid(...lessonTypeValues)
        .optional()
        .default('Video'),
    status: joi_1.default.string()
        .valid(...statusValues)
        .optional()
        .default('Published'),
    visibility: joi_1.default.string()
        .valid(...visibilityValues)
        .optional()
        .default('Enrolled'),
    duration: joi_1.default.number().min(0).optional().default(0),
    estimatedStudyTime: joi_1.default.number().min(0).optional().default(0),
    order: joi_1.default.number().integer().min(1).optional(),
    isPreview: joi_1.default.boolean().optional().default(false),
    isPublished: joi_1.default.boolean().optional().default(true),
    videoUrl: joi_1.default.string().trim().optional().allow('', null),
    attachmentUrl: joi_1.default.string().trim().optional().allow('', null),
    completionRequirement: joi_1.default.string()
        .valid(...completionRequirementValues)
        .optional()
        .default('Watch75'),
    releaseDate: joi_1.default.date().iso().optional().allow(null),
    prerequisites: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern)).optional(),
});
/**
 * Joi schema for updating an existing Lesson.
 */
exports.updateLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).max(200).optional(),
    description: joi_1.default.string().trim().max(2000).optional().allow('', null),
    shortDescription: joi_1.default.string().trim().max(500).optional().allow('', null),
    content: joi_1.default.string().trim().optional().allow('', null),
    sectionId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    unitId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
    lessonType: joi_1.default.string().valid(...lessonTypeValues).optional(),
    status: joi_1.default.string().valid(...statusValues).optional(),
    visibility: joi_1.default.string().valid(...visibilityValues).optional(),
    duration: joi_1.default.number().min(0).optional(),
    estimatedStudyTime: joi_1.default.number().min(0).optional(),
    order: joi_1.default.number().integer().min(1).optional(),
    isPreview: joi_1.default.boolean().optional(),
    isPublished: joi_1.default.boolean().optional(),
    videoUrl: joi_1.default.string().trim().optional().allow('', null),
    attachmentUrl: joi_1.default.string().trim().optional().allow('', null),
    completionRequirement: joi_1.default.string().valid(...completionRequirementValues).optional(),
    releaseDate: joi_1.default.date().iso().optional().allow(null),
    prerequisites: joi_1.default.array().items(joi_1.default.string().pattern(mongoIdPattern)).optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be updated',
});
/**
 * Joi schema for reordering lessons.
 */
exports.reorderLessonsSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        id: joi_1.default.string().pattern(mongoIdPattern).required(),
        order: joi_1.default.number().integer().min(1).required(),
    }))
        .min(1)
        .required(),
});
/**
 * Joi schema for moving a lesson to another section.
 */
exports.moveLessonSchema = joi_1.default.object({
    targetSectionId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid target section ID format',
        'any.required': 'Target section ID is required',
    }),
    order: joi_1.default.number().integer().min(1).optional(),
});
exports.default = {
    createLessonSchema: exports.createLessonSchema,
    updateLessonSchema: exports.updateLessonSchema,
    reorderLessonsSchema: exports.reorderLessonsSchema,
    moveLessonSchema: exports.moveLessonSchema,
};
