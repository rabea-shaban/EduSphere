"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSession = void 0;
const mongoose_1 = require("mongoose");
const teacherSessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    token: {
        type: String,
        select: false,
    },
    deviceName: {
        type: String,
        required: [true, 'Device name is required'],
        trim: true,
        default: 'Unknown Device',
    },
    ipAddress: {
        type: String,
        required: [true, 'IP Address is required'],
        trim: true,
        default: '127.0.0.1',
    },
    location: {
        type: String,
        default: 'القاهرة، مصر',
        trim: true,
    },
    isCurrent: {
        type: Boolean,
        default: false,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
teacherSessionSchema.index({ userId: 1, lastActive: -1 });
exports.TeacherSession = (0, mongoose_1.model)('TeacherSession', teacherSessionSchema);
exports.default = exports.TeacherSession;
