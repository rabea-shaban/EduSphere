"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient reference is required'],
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Notification message body is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: [
            'Course',
            'Lesson',
            'Assignment',
            'Quiz',
            'Exam',
            'Payment',
            'Announcement',
            'System',
            'Chat',
        ],
        required: [true, 'Notification type is required'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    deliveryChannel: [
        {
            type: String,
            enum: ['InApp', 'Push', 'Email', 'SMS'],
            default: 'InApp',
        },
    ],
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Indexes
notificationSchema.index({ recipientId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = exports.Notification;
