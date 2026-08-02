import { Document, Types } from 'mongoose';

export type ConversationType = 'Private' | 'Group' | 'Support';

export interface IConversation {
  participants: Types.ObjectId[];
  organizationId?: Types.ObjectId;
  courseId?: Types.ObjectId;
  conversationType: ConversationType;
  groupTitle?: string;
  groupAvatar?: string;
  groupAdmin?: Types.ObjectId;
  description?: string;
  lastMessage?: Types.ObjectId; // References Message Model
  lastSender?: Types.ObjectId; // References User Model
  lastMessageAt?: Date;
  unreadCount?: Map<string, number>; // Map of userId string -> unread count
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversationDocument extends IConversation, Document {}
