"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Quiz reference is required'],
    },
    questionBankId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'QuestionBank',
        required: [true, 'Question Bank reference is required'],
    },
    marks: {
        type: Number,
        required: [true, 'Marks are required'],
        min: [0, 'Marks cannot be negative'],
    },
    order: {
        type: Number,
        required: [true, 'Display order is required'],
    },
}, {
    timestamps: true,
});
// Indexes
questionSchema.index({ quizId: 1, questionBankId: 1 }, { unique: true });
questionSchema.index({ quizId: 1 });
questionSchema.index({ questionBankId: 1 });
questionSchema.index({ order: 1 });
exports.Question = (0, mongoose_1.model)('Question', questionSchema);
exports.default = exports.Question;
