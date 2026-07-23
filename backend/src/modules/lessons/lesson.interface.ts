import { Document, Types } from 'mongoose';

export type LessonType = 'Video' | 'PDF' | 'Quiz' | 'Assignment' | 'Text';

export interface ILesson {
  title: string;
  slug: string;
  description?: string;
  unitId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonType: LessonType;
  duration: number; // in minutes
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonDocument extends ILesson, Document {}
