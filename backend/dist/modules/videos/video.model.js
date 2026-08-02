"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
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
        required: [true, 'Video title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    provider: {
        type: String,
        enum: ['Cloudinary'],
        default: 'Cloudinary',
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
    },
    publicId: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0, // in seconds
    },
    quality: {
        type: String,
        enum: ['360', '480', '720', '1080'],
        default: '720',
    },
    captions: [
        {
            language: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    isPreview: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Indexes
videoSchema.index({ lessonId: 1 });
videoSchema.index({ courseId: 1 });
videoSchema.index({ isPublished: 1 });
exports.Video = (0, mongoose_1.model)('Video', videoSchema);
exports.default = exports.Video;
