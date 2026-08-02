"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallSignal = void 0;
const mongoose_1 = require("mongoose");
const callSignalSchema = new mongoose_1.Schema({
    callerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Conversation' },
    callerName: { type: String, default: 'مستخدم المنصة' },
    callerAvatar: { type: String },
    callType: { type: String, enum: ['voice', 'video'], default: 'voice' },
    offer: { type: mongoose_1.Schema.Types.Mixed },
    answer: { type: mongoose_1.Schema.Types.Mixed },
    callerCandidates: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    targetCandidates: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    connectedAt: { type: Date },
    status: {
        type: String,
        enum: ['outgoing', 'incoming', 'connected', 'rejected', 'ended'],
        default: 'outgoing',
    },
}, { timestamps: true });
callSignalSchema.index({ targetUserId: 1, status: 1 });
callSignalSchema.index({ callerId: 1, status: 1 });
exports.CallSignal = (0, mongoose_1.model)('CallSignal', callSignalSchema);
