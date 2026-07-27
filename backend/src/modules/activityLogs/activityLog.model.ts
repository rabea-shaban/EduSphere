import { Schema, model, Document } from 'mongoose';

export interface IActivityLogDocument extends Document {
  userId?: Schema.Types.ObjectId;
  userName?: string;
  userRole?: string;
  action: string;
  category: 'Login' | 'Course' | 'Payment' | 'Security' | 'Admin' | 'Settings' | 'CMS' | 'Roles';
  module: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: {
    endpoint?: string;
    method?: string;
    oldData?: any;
    newData?: any;
    executionTimeMs?: number;
    errorMessage?: string;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      trim: true,
    },
    userRole: {
      type: String,
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Log action string is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Login', 'Course', 'Payment', 'Security', 'Admin', 'Settings', 'CMS', 'Roles'],
      default: 'Admin',
    },
    module: {
      type: String,
      default: 'System',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'WARNING'],
      default: 'SUCCESS',
    },
    details: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: '127.0.0.1',
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
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ status: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = model<IActivityLogDocument>('ActivityLog', activityLogSchema);
export default ActivityLog;
