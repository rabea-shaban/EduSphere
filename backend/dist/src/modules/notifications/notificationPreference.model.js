"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreference = void 0;
const mongoose_1 = require("mongoose");
const notificationPreferenceSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        unique: true,
    },
    channels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
    },
    categories: {
        courseEnrollments: { type: Boolean, default: true },
        assignments: { type: Boolean, default: true },
        quizzes: { type: Boolean, default: true },
        reviews: { type: Boolean, default: true },
        paymentsAndWithdrawals: { type: Boolean, default: true },
        systemAnnouncements: { type: Boolean, default: true },
        securityAlerts: { type: Boolean, default: true },
    },
    frequency: {
        type: String,
        enum: ['INSTANT', 'DAILY_DIGEST', 'WEEKLY_DIGEST'],
        default: 'INSTANT',
    },
}, {
    timestamps: true,
});
exports.NotificationPreference = (0, mongoose_1.model)('NotificationPreference', notificationPreferenceSchema);
exports.default = exports.NotificationPreference;
