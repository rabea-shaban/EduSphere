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
const reactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    emoji: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
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
    clientMessageId: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
        default: '',
        validate: {
            validator: function (value) {
                // Allow empty string only when there are attachments
                const hasAttachments = Array.isArray(this.attachments) && this.attachments.length > 0;
                return hasAttachments || (typeof value === 'string' && value.trim().length > 0);
            },
            message: 'Message text is required when no attachments are provided',
        },
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
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
    isRead: {
        type: Boolean,
        default: false,
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
    reactions: [reactionSchema],
}, {
    timestamps: true,
});
// Indexes for fast pagination and lookup
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ clientMessageId: 1 });
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = exports.Message;
