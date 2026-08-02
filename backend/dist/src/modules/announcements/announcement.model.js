"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const mongoose_1 = require("mongoose");
const announcementSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        trim: true,
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator reference is required'],
    },
    targetType: {
        type: String,
        enum: ['All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade'],
        required: [true, 'Target type classification is required'],
    },
    targetIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    publishDate: {
        type: Date,
        default: Date.now,
    },
    expireDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Archived'],
        default: 'Draft',
    },
}, {
    timestamps: true,
});
// Indexes
announcementSchema.index({ createdBy: 1 });
announcementSchema.index({ targetType: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ publishDate: -1 });
exports.Announcement = (0, mongoose_1.model)('Announcement', announcementSchema);
exports.default = exports.Announcement;
