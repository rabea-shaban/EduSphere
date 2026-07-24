import { Document, Types } from 'mongoose';

export interface ITestimonial {
  studentName: string;
  studentImage?: string;
  courseId?: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITestimonialDocument extends ITestimonial, Document {}
