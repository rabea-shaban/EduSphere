import { Document, Types } from 'mongoose';

export type ConversationType = 'Private' | 'Group' | 'Support';

export interface IConversation {
  participants: Types.ObjectId[];
  organizationId?: Types.ObjectId;
  courseId?: Types.ObjectId;
  conversationType: ConversationType;
  lastMessage?: Types.ObjectId; // References Message Model
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversationDocument extends IConversation, Document {}
