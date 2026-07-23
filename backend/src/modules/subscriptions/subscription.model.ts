import { Schema, model } from 'mongoose';
import { ISubscriptionPlanDocument } from './subscription.interface';

const subscriptionPlanSchema = new Schema<ISubscriptionPlanDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    name: {
      type: String,
      required: [true, 'Subscription plan name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subscriptionType: {
      type: String,
      enum: ['Free', 'Monthly', 'Yearly', 'Lifetime'],
      required: [true, 'Subscription type is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      trim: true,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    maxStudents: {
      type: Number,
      required: [true, 'Maximum student count limit is required'],
      min: [1, 'Must allow at least 1 student'],
    },
    maxTeachers: {
      type: Number,
      required: [true, 'Maximum teacher count limit is required'],
      min: [1, 'Must allow at least 1 teacher'],
    },
    maxCourses: {
      type: Number,
      required: [true, 'Maximum course count limit is required'],
      min: [1, 'Must allow at least 1 course'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionPlanSchema.index({ status: 1 });
subscriptionPlanSchema.index({ subscriptionType: 1 });

export const SubscriptionPlan = model<ISubscriptionPlanDocument>('SubscriptionPlan', subscriptionPlanSchema);
export default SubscriptionPlan;
