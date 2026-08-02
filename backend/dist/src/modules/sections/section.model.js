"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
const mongoose_1 = require("mongoose");
const sectionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Section title is required'],
        trim: true,
        maxlength: [200, 'Section title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Section description cannot exceed 2000 characters'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
        index: true,
    },
    order: {
        type: Number,
        required: [true, 'Section order is required'],
        min: [1, 'Order must be at least 1'],
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Hidden', 'Archived'],
        default: 'Draft',
    },
    visibility: {
        type: String,
        enum: ['Public', 'Private', 'Enrolled'],
        default: 'Enrolled',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    deletedAt: {
        type: Date,
    },
    estimatedDuration: {
        type: Number,
        default: 0, // in minutes
    },
    totalLessons: {
        type: Number,
        default: 0,
    },
    completionRule: {
        type: String,
        enum: ['AllLessons', 'MinimumLessons', 'AnyLesson'],
        default: 'AllLessons',
    },
    minimumLessonsRequired: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
// Compound indexes for performance
sectionSchema.index({ courseId: 1, order: 1 });
sectionSchema.index({ courseId: 1, status: 1 });
sectionSchema.index({ courseId: 1, isDeleted: 1 });
sectionSchema.index({ courseId: 1, order: 1, isDeleted: 1 });
// Default filter: exclude soft-deleted records
sectionSchema.pre(/^find/, function () {
    if (!this.getOptions().withDeleted) {
        this.where({ isDeleted: false });
    }
});
exports.Section = (0, mongoose_1.model)('Section', sectionSchema);
exports.default = exports.Section;
