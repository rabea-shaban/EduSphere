import { Document, Types } from 'mongoose';

export type SubscriptionType = 'Free' | 'Monthly' | 'Yearly' | 'Lifetime';
export type SubscriptionStatus = 'Active' | 'Inactive';

export interface ISubscriptionPlan {
  organizationId?: Types.ObjectId;
  name: string;
  description?: string;
  subscriptionType: SubscriptionType;
  price: number;
  currency: string;
  features: string[];
  maxStudents?: number;
  maxTeachers?: number;
  maxCourses?: number;
  isPopular?: boolean;
  subscribersCount?: number;
  status: SubscriptionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriptionPlanDocument extends ISubscriptionPlan, Document {}
