import { Document, Types } from 'mongoose';

export interface IUnit {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  order: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitDocument extends IUnit, Document {}
