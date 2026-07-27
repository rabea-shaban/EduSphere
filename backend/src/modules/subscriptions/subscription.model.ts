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
      default: 'Monthly',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'EGP',
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
      default: 10000,
    },
    maxTeachers: {
      type: Number,
      default: 50,
    },
    maxCourses: {
      type: Number,
      default: 100,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    subscribersCount: {
      type: Number,
      default: 0,
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
