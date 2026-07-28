import { Schema, model, Document, Types } from 'mongoose';

export interface INotificationPreference {
  userId: Types.ObjectId;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  categories: {
    courseEnrollments: boolean;
    assignments: boolean;
    quizzes: boolean;
    reviews: boolean;
    paymentsAndWithdrawals: boolean;
    systemAnnouncements: boolean;
    securityAlerts: boolean;
  };
  frequency: 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationPreferenceDocument extends INotificationPreference, Document {}

const notificationPreferenceSchema = new Schema<INotificationPreferenceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    categories: {
      courseEnrollments: { type: Boolean, default: true },
      assignments: { type: Boolean, default: true },
      quizzes: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      paymentsAndWithdrawals: { type: Boolean, default: true },
      systemAnnouncements: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
    },
    frequency: {
      type: String,
      enum: ['INSTANT', 'DAILY_DIGEST', 'WEEKLY_DIGEST'],
      default: 'INSTANT',
    },
  },
  {
    timestamps: true,
  }
);

notificationPreferenceSchema.index({ userId: 1 });

export const NotificationPreference = model<INotificationPreferenceDocument>(
  'NotificationPreference',
  notificationPreferenceSchema
);

export default NotificationPreference;
