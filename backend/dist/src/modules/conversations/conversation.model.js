"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Participants are required'],
        },
    ],
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
    conversationType: {
        type: String,
        enum: ['Private', 'Group', 'Support'],
        required: [true, 'Conversation type is required'],
        default: 'Private',
    },
    groupTitle: {
        type: String,
        trim: true,
    },
    groupAvatar: {
        type: String,
        trim: true,
    },
    groupAdmin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        trim: true,
    },
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
    },
    lastSender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    lastMessageAt: {
        type: Date,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {},
    },
}, {
    timestamps: true,
});
// Compound Indexes for fast sorting and listing
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ conversationType: 1 });
exports.Conversation = (0, mongoose_1.model)('Conversation', conversationSchema);
exports.default = exports.Conversation;
