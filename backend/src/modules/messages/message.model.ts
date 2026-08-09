import { Schema, model } from 'mongoose';
import { IMessageDocument } from './message.interface';

const seenReceiptSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seenAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
  },
  { _id: false }
);

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation reference is required'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
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
        validator: function (this: any, value: string) {
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
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'delivering', 'persisted'],
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    seenBy: [seenReceiptSchema],
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast pagination and lookup
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ clientMessageId: 1 });

// Compound unique sparse index for idempotent message persistence.
// Prevents duplicate DB records if the same (conversationId + senderId + clientMessageId)
// arrives twice via socket retry or HTTP fallback.
messageSchema.index(
  { conversationId: 1, senderId: 1, clientMessageId: 1 },
  { unique: true, sparse: true, name: 'idempotent_message_key' }
);

export const Message = model<IMessageDocument>('Message', messageSchema);
export default Message;
