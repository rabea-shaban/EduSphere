import { Document, Types } from 'mongoose';

export type PaymentMethod = 'Stripe' | 'Cash' | 'Bank Transfer' | 'Wallet';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface IPayment {
  studentId?: Types.ObjectId; // populated if student purchases course
  organizationId?: Types.ObjectId; // populated if organization buys subscription
  courseId?: Types.ObjectId; // if purchasing a course
  subscriptionId?: Types.ObjectId; // if purchasing a subscription
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentReference: string; // Stripe Session ID or bank reference
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentDocument extends IPayment, Document {}
