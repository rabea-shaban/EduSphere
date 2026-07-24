import { Document, Types } from 'mongoose';

export type NotificationType =
  | 'Course'
  | 'Lesson'
  | 'Assignment'
  | 'Quiz'
  | 'Exam'
  | 'Payment'
  | 'Announcement'
  | 'System'
  | 'Chat';

export type DeliveryChannel = 'InApp' | 'Push' | 'Email' | 'SMS';
export type NotificationPriority = 'Low' | 'Medium' | 'High';

export interface INotification {
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  deliveryChannel: DeliveryChannel[];
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}
