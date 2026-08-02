"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
const mongoose_1 = require("mongoose");
const answerSchema = new mongoose_1.Schema({
    attemptId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ExamAttempt',
        required: [true, 'Exam attempt reference is required'],
    },
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required: [true, 'Question reference is required'],
    },
    studentAnswer: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    correctAnswer: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
    marks: {
        type: Number,
        default: 0,
        min: [0, 'Marks cannot be negative'],
    },
}, {
    timestamps: true,
});
// Indexes
answerSchema.index({ attemptId: 1 });
answerSchema.index({ questionId: 1 });
answerSchema.index({ attemptId: 1, questionId: 1 }, { unique: true });
exports.Answer = (0, mongoose_1.model)('Answer', answerSchema);
exports.default = exports.Answer;
