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
        ref: 'Organization', // if multi-tenant isolated
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
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
    },
    lastMessageAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ conversationType: 1 });
conversationSchema.index({ lastMessageAt: -1 });
exports.Conversation = (0, mongoose_1.model)('Conversation', conversationSchema);
exports.default = exports.Conversation;
