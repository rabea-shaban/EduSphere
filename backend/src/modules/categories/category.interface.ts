import { Document, Types } from 'mongoose';

export type CategoryType = 'Blog' | 'Course' | 'General';

export interface ICategory {
  name: string;
  slug: string; // Unique
  description?: string;
  type: CategoryType;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {}
