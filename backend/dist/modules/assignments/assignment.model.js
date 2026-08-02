"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const assignmentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    unitId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, 'Unit reference is required'],
    },
    lessonId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: [true, 'Lesson reference is required'],
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    attachments: [
        {
            type: String,
            trim: true,
        },
    ],
    instructions: {
        type: String,
        trim: true,
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks are required'],
        min: [0, 'Marks cannot be negative'],
    },
    passingMarks: {
        type: Number,
        required: [true, 'Passing marks are required'],
        min: [0, 'Passing marks cannot be negative'],
    },
    allowLateSubmission: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Closed'],
        default: 'Draft',
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
// Indexes
assignmentSchema.index({ courseId: 1 });
assignmentSchema.index({ unitId: 1 });
assignmentSchema.index({ lessonId: 1 });
assignmentSchema.index({ teacherId: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ deletedAt: 1 });
// Soft Delete Query Middleware
assignmentSchema.pre(/^find|^count/, function () {
    const options = this.getOptions();
    if (options && options.withDeleted)
        return;
    this.where({ deletedAt: null });
});
exports.Assignment = (0, mongoose_1.model)('Assignment', assignmentSchema);
exports.default = exports.Assignment;
