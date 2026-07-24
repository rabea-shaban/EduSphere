import { Document, Types } from 'mongoose';

export interface IFaq {
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFaqDocument extends IFaq, Document {}
