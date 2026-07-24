import { Schema, model } from 'mongoose';
import { IActivityLogDocument } from './activityLog.interface';

const activityLogSchema = new Schema<IActivityLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    action: {
      type: String,
      required: [true, 'Log action string is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Login', 'Course', 'Payment', 'Security', 'Admin'],
      required: [true, 'Log category is required'],
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ category: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = model<IActivityLogDocument>('ActivityLog', activityLogSchema);
export default ActivityLog;
