"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamAttempt = void 0;
const mongoose_1 = require("mongoose");
const examAttemptSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Quiz reference is required'],
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    submittedAt: {
        type: Date,
    },
    timeTakenSeconds: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: 0,
    },
    percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    passed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['InProgress', 'Submitted', 'Graded'],
        default: 'InProgress',
    },
}, {
    timestamps: true,
});
// Indexes
examAttemptSchema.index({ studentId: 1 });
examAttemptSchema.index({ quizId: 1 });
examAttemptSchema.index({ status: 1 });
examAttemptSchema.index({ studentId: 1, quizId: 1 });
exports.ExamAttempt = (0, mongoose_1.model)('ExamAttempt', examAttemptSchema);
exports.default = exports.ExamAttempt;
