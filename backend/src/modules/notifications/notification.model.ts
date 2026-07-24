import { Schema, model } from 'mongoose';
import { INotificationDocument } from './notification.interface';

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient reference is required'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message body is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'Course',
        'Lesson',
        'Assignment',
        'Quiz',
        'Exam',
        'Payment',
        'Announcement',
        'System',
        'Chat',
      ],
      required: [true, 'Notification type is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    deliveryChannel: [
      {
        type: String,
        enum: ['InApp', 'Push', 'Email', 'SMS'],
        default: 'InApp',
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipientId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model<INotificationDocument>('Notification', notificationSchema);
export default Notification;
