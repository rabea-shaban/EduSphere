"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBank = void 0;
const mongoose_1 = require("mongoose");
const questionBankSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        trim: true,
    },
    question: {
        type: String,
        required: [true, 'Question body text is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['MCQ', 'Multiple Answers', 'True False', 'Fill Blank', 'Short Answer', 'Essay', 'Matching', 'Ordering'],
        required: [true, 'Question type is required'],
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Difficulty level is required'],
    },
    subject: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject reference is required'],
    },
    grade: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Grade',
        required: [true, 'Grade reference is required'],
    },
    teacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    lesson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
    options: [
        {
            type: String,
            trim: true,
        },
    ],
    correctAnswer: {
        type: mongoose_1.Schema.Types.Mixed,
        required: [true, 'Correct answer is required'],
    },
    marks: {
        type: Number,
        required: [true, 'Marks are required'],
        min: [0, 'Marks cannot be negative'],
    },
    explanation: {
        type: String,
        trim: true,
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    status: {
        type: String,
        enum: ['Active', 'Draft'],
        default: 'Active',
    },
}, {
    timestamps: true,
});
// Indexes
questionBankSchema.index({ subject: 1 });
questionBankSchema.index({ grade: 1 });
questionBankSchema.index({ teacher: 1 });
questionBankSchema.index({ difficulty: 1 });
questionBankSchema.index({ status: 1 });
questionBankSchema.index({ tags: 1 });
exports.QuestionBank = (0, mongoose_1.model)('QuestionBank', questionBankSchema);
exports.default = exports.QuestionBank;
