import { Document, Types } from 'mongoose';

export type LessonType =
  | 'Video'
  | 'Article'
  | 'Live'
  | 'PDF'
  | 'Resource'
  | 'Interactive'
  | 'Quiz'
  | 'Assignment'
  | 'Text';

export type LessonStatus = 'Draft' | 'Published' | 'Scheduled' | 'Hidden' | 'Archived';
export type LessonVisibility = 'Public' | 'Private' | 'Enrolled';
export type CompletionRequirement = 'Watch75' | 'Watch100' | 'PassQuiz' | 'SubmitAssignment' | 'Manual';

export interface ILesson {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  content?: string;
  sectionId?: Types.ObjectId;
  unitId?: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonType: LessonType;
  duration: number; // in minutes
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  status: LessonStatus;
  visibility: LessonVisibility;
  videoUrl?: string;
  attachmentUrl?: string;
  estimatedStudyTime?: number; // in minutes
  completionRequirement?: CompletionRequirement;
  releaseDate?: Date;
  prerequisites?: Types.ObjectId[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonDocument extends ILesson, Document {}
