import { Document, Types } from 'mongoose';

export type ActivityCategory = 'Login' | 'Course' | 'Payment' | 'Security' | 'Admin';

export interface IActivityLog {
  userId: Types.ObjectId;
  action: string;
  category: ActivityCategory;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IActivityLogDocument extends IActivityLog, Document {}
