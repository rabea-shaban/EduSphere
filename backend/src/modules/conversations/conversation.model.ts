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
      ref: 'Organization', // if multi-tenant isolated
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
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ conversationType: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const Conversation = model<IConversationDocument>('Conversation', conversationSchema);
export default Conversation;
