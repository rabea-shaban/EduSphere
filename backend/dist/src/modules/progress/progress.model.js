"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const progressSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    lessonId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: [true, 'Lesson reference is required'],
    },
    videoProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    watchTime: {
        type: Number,
        default: 0,
        min: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    },
    lastPosition: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
// Indexes
progressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ studentId: 1, courseId: 1 });
progressSchema.index({ studentId: 1 });
progressSchema.index({ courseId: 1 });
progressSchema.index({ lessonId: 1 });
exports.Progress = (0, mongoose_1.model)('Progress', progressSchema);
exports.default = exports.Progress;
