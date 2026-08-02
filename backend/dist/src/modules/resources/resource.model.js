"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = require("mongoose");
const resourceSchema = new mongoose_1.Schema({
    lessonId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: [true, 'Lesson reference is required'],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    resourceType: {
        type: String,
        enum: ['PDF', 'Image', 'ZIP', 'Code', 'Document', 'External Link'],
        required: [true, 'Resource type is required'],
    },
    url: {
        type: String,
        required: [true, 'Resource URL is required'],
    },
    publicId: {
        type: String,
    },
    size: {
        type: Number,
        default: 0, // in bytes
    },
    extension: {
        type: String,
    },
    downloadable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexes
resourceSchema.index({ lessonId: 1 });
resourceSchema.index({ courseId: 1 });
exports.Resource = (0, mongoose_1.model)('Resource', resourceSchema);
exports.default = exports.Resource;
