import { Document, Types } from 'mongoose';

export type EnrollmentStatus = 'Pending' | 'Active' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Free';

export interface IEnrollment {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  teacherId: Types.ObjectId;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  purchasePrice: number;
  enrolledAt: Date;
  completedAt?: Date;
  certificateIssued: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEnrollmentDocument extends IEnrollment, Document {}
