"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const mongoose_1 = require("mongoose");
const activityLogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    userName: {
        type: String,
        trim: true,
    },
    userRole: {
        type: String,
        trim: true,
    },
    action: {
        type: String,
        required: [true, 'Log action string is required'],
        trim: true,
    },
    category: {
        type: String,
        enum: ['Login', 'Course', 'Payment', 'Security', 'Admin', 'Settings', 'CMS', 'Roles'],
        default: 'Admin',
    },
    module: {
        type: String,
        default: 'System',
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'WARNING'],
        default: 'SUCCESS',
    },
    details: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    ipAddress: {
        type: String,
        trim: true,
        default: '127.0.0.1',
    },
    userAgent: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Indexes
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ category: 1 });
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ status: 1 });
activityLogSchema.index({ createdAt: -1 });
exports.ActivityLog = (0, mongoose_1.model)('ActivityLog', activityLogSchema);
exports.default = exports.ActivityLog;
