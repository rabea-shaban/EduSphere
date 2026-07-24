import { Schema, model } from 'mongoose';
import { IAiChatHistoryDocument, IAiTokenUsageDocument } from './ai.interface';

const aiChatHistorySchema = new Schema<IAiChatHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  {
    timestamps: true,
  }
);

aiChatHistorySchema.index({ userId: 1 });
aiChatHistorySchema.index({ createdAt: -1 });

const aiTokenUsageSchema = new Schema<IAiTokenUsageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

aiTokenUsageSchema.index({ userId: 1 });
aiTokenUsageSchema.index({ organizationId: 1 });
aiTokenUsageSchema.index({ createdAt: -1 });

export const AiChatHistory = model<IAiChatHistoryDocument>('AiChatHistory', aiChatHistorySchema);
export const AiTokenUsage = model<IAiTokenUsageDocument>('AiTokenUsage', aiTokenUsageSchema);
