"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmissionSchema = exports.updateSubmissionSchema = exports.submitAssignmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
/**
 * Joi validation schema for submitting an assignment.
 */
exports.submitAssignmentSchema = joi_1.default.object({
    assignmentId: joi_1.default.string().pattern(mongoIdPattern).required().messages({
        'string.pattern.base': 'Invalid assignment ID format',
        'any.required': 'Assignment ID is required',
    }),
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    textAnswer: joi_1.default.string().trim().optional(),
});
/**
 * Joi validation schema for student updating their submission before the due date.
 */
exports.updateSubmissionSchema = joi_1.default.object({
    attachments: joi_1.default.array().items(joi_1.default.string().trim()).optional(),
    textAnswer: joi_1.default.string().trim().optional(),
})
    .min(1)
    .messages({
    'object.min': 'At least one field (attachments or textAnswer) must be updated',
});
/**
 * Joi validation schema for teachers grading an assignment submission.
 */
exports.gradeSubmissionSchema = joi_1.default.object({
    grade: joi_1.default.number().min(0).required().messages({
        'number.base': 'Grade must be a number',
        'any.required': 'Grade is required',
    }),
    feedback: joi_1.default.string().trim().optional(),
});
