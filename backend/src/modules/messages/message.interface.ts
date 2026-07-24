import { Document, Types } from 'mongoose';

export type MessageType = 'Text' | 'Image' | 'Video' | 'Audio' | 'Document' | 'System';

export interface ISeenReceipt {
  userId: Types.ObjectId;
  seenAt: Date;
}

export interface IMessage {
  conversationId: Types.ObjectId; // References Conversation Model
  senderId: Types.ObjectId; // References User Model
  message: string;
  messageType: MessageType;
  attachments: string[];
  replyTo?: Types.ObjectId; // References Message Model
  edited: boolean;
  editedAt?: Date;
  deletedFor: Types.ObjectId[]; // List of user IDs who hid/deleted this message
  seenBy: ISeenReceipt[]; // List of participants who read this message
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessageDocument extends IMessage, Document {}
