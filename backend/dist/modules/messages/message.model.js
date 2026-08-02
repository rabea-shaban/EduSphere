"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const seenReceiptSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seenAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { _id: false });
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: [true, 'Conversation reference is required'],
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender reference is required'],
    },
    message: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
    },
    messageType: {
        type: String,
        enum: ['Text', 'Image', 'Video', 'Audio', 'Document', 'System'],
        default: 'Text',
    },
    attachments: [
        {
            type: String,
            trim: true,
        },
    ],
    replyTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
    },
    edited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
    },
    deletedFor: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    seenBy: [seenReceiptSchema],
}, {
    timestamps: true,
});
// Indexes
messageSchema.index({ conversationId: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ createdAt: -1 });
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = exports.Message;
