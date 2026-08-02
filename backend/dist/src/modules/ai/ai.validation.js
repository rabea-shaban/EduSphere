"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiStudyPlanSchema = exports.aiModerateSchema = exports.aiEssayEvalSchema = exports.aiAssignmentHelperSchema = exports.aiSummarizeSchema = exports.aiQuizGenSchema = exports.aiChatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
exports.aiChatSchema = joi_1.default.object({
    prompt: joi_1.default.string().trim().required().messages({
        'string.empty': 'Prompt is required',
    }),
    courseId: joi_1.default.string().pattern(mongoIdPattern).optional(),
});
exports.aiQuizGenSchema = joi_1.default.object({
    text: joi_1.default.string().trim().required(),
    questionType: joi_1.default.string().valid('MCQ', 'True/False', 'Short Answer', 'Essay').optional().default('MCQ'),
    numberOfQuestions: joi_1.default.number().integer().min(1).max(20).optional().default(5),
});
exports.aiSummarizeSchema = joi_1.default.object({
    text: joi_1.default.string().trim().required(),
});
exports.aiAssignmentHelperSchema = joi_1.default.object({
    question: joi_1.default.string().trim().required(),
});
exports.aiEssayEvalSchema = joi_1.default.object({
    essay: joi_1.default.string().trim().required(),
});
exports.aiModerateSchema = joi_1.default.object({
    text: joi_1.default.string().trim().required(),
});
exports.aiStudyPlanSchema = joi_1.default.object({
    examDate: joi_1.default.date().iso().required(),
    weakSubjects: joi_1.default.array().items(joi_1.default.string().trim()).required(),
    availableHoursPerDay: joi_1.default.number().min(1).max(24).required(),
});
