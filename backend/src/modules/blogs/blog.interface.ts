import { Document, Types } from 'mongoose';

export type BlogStatus = 'Draft' | 'Published';

export interface IBlog {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  authorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  tags: string[];
  status: BlogStatus;
  views: number;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogDocument extends IBlog, Document {}
