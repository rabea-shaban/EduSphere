import { Schema, model } from 'mongoose';
import { IConversationDocument } from './conversation.interface';

const conversationSchema = new Schema<IConversationDocument>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Participants are required'],
      },
    ],
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    courseId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastSender: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for fast sorting and listing
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ conversationType: 1 });

export const Conversation = model<IConversationDocument>('Conversation', conversationSchema);
export default Conversation;
