"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSession = void 0;
const mongoose_1 = require("mongoose");
const liveSessionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Live Session title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher reference is required'],
    },
    provider: {
        type: String,
        enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'Custom'],
        required: [true, 'Meeting provider is required'],
    },
    meetingUrl: {
        type: String,
        required: [true, 'Meeting URL is required'],
        trim: true,
    },
    meetingId: {
        type: String,
        trim: true,
    },
    meetingPassword: {
        type: String,
        trim: true,
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'],
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required'],
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Live', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
    recordingUrl: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Indexes
liveSessionSchema.index({ courseId: 1 });
liveSessionSchema.index({ teacherId: 1 });
liveSessionSchema.index({ status: 1 });
liveSessionSchema.index({ startTime: 1 });
exports.LiveSession = (0, mongoose_1.model)('LiveSession', liveSessionSchema);
exports.default = exports.LiveSession;
