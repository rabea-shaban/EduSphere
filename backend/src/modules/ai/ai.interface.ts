import { Document, Types } from 'mongoose';

export interface IAiChatHistory {
  userId: Types.ObjectId;
  prompt: string;
  response: string;
  courseId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAiChatHistoryDocument extends IAiChatHistory, Document {}

export interface IAiTokenUsage {
  userId: Types.ObjectId;
  organizationId?: Types.ObjectId;
  feature: string; // e.g. 'aiChat', 'aiQuizGenerator'
  tokensUsed: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAiTokenUsageDocument extends IAiTokenUsage, Document {}
