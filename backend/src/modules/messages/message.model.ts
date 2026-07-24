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
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    seenBy: [seenReceiptSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ conversationId: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = model<IMessageDocument>('Message', messageSchema);
export default Message;
