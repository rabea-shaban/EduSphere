import { Schema, model } from 'mongoose';
import { IMessageDocument } from './message.interface';

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: String,
      required: [true, 'Conversation ID is required'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver reference is required'],
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    messageType: {
      type: String,
      enum: ['Text', 'Image', 'File', 'System'],
      default: 'Text',
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ conversationId: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = model<IMessageDocument>('Message', messageSchema);
export default Message;
