"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTokenUsage = exports.AiChatHistory = void 0;
const mongoose_1 = require("mongoose");
const aiChatHistorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
        trim: true,
    },
    response: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
    },
}, {
    timestamps: true,
});
aiChatHistorySchema.index({ userId: 1 });
aiChatHistorySchema.index({ createdAt: -1 });
const aiTokenUsageSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    feature: {
        type: String,
        required: true,
    },
    tokensUsed: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});
aiTokenUsageSchema.index({ userId: 1 });
aiTokenUsageSchema.index({ organizationId: 1 });
aiTokenUsageSchema.index({ createdAt: -1 });
exports.AiChatHistory = (0, mongoose_1.model)('AiChatHistory', aiChatHistorySchema);
exports.AiTokenUsage = (0, mongoose_1.model)('AiTokenUsage', aiTokenUsageSchema);
