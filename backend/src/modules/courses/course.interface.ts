import { Document, Types } from 'mongoose';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Draft' | 'Published' | 'Archived';

export interface ICourse {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  teacher: Types.ObjectId;
  academicYear: Types.ObjectId;
  grade: Types.ObjectId;
  subject: Types.ObjectId;
  term: Types.ObjectId;
  language: string;
  price: number;
  discountPrice: number;
  duration: number; // in minutes or hours
  level: CourseLevel;
  tags: string[];
  requirements: string[];
  objectives: string[];
  status: CourseStatus;
  isFeatured: boolean;
  isFree: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourseDocument extends ICourse, Document {}
