import { Document, Types } from 'mongoose';

export type NotificationType = 'Course' | 'Assignment' | 'Quiz' | 'Exam' | 'Payment' | 'Announcement' | 'System' | 'Chat';
export type DeliveryChannel = 'InApp' | 'Push' | 'Email';

export interface INotification {
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date;
  deliveryChannel: DeliveryChannel;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}
