import { Document, Types } from 'mongoose';

export type MessageType = 'Text' | 'Image' | 'File' | 'System';

export interface IMessage {
  conversationId: string; // Composite ID sorted, e.g. user1_user2
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  attachments: string[];
  messageType: MessageType;
  isSeen: boolean;
  seenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessageDocument extends IMessage, Document {}
