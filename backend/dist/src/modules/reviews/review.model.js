"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1 star'],
        max: [5, 'Rating cannot exceed 5 stars'],
    },
    title: {
        type: String,
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        minLength: [5, 'Comment must be at least 5 characters long'],
        maxLength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    sentiment: {
        type: String,
        enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
        default: 'POSITIVE',
    },
    keywords: [
        {
            type: String,
            trim: true,
        },
    ],
    teacherReply: {
        replyText: {
            type: String,
            trim: true,
            maxLength: [1500, 'Reply text cannot exceed 1500 characters'],
        },
        repliedAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
        },
    },
    helpfulVotes: {
        count: {
            type: Number,
            default: 0,
        },
        userIds: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    status: {
        type: String,
        enum: ['APPROVED', 'PENDING_MODERATION', 'REJECTED', 'FLAGGED'],
        default: 'APPROVED',
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    flaggedReason: {
        type: String,
        trim: true,
    },
    flaggedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
// Indexes
reviewSchema.index({ courseId: 1, studentId: 1 }, { unique: true });
reviewSchema.index({ courseId: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ sentiment: 1 });
reviewSchema.index({ status: 1 });
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = exports.Review;
