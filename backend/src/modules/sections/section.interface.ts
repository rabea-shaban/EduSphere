import { Document, Types } from 'mongoose';

export type SectionStatus = 'Draft' | 'Published' | 'Hidden' | 'Archived';
export type SectionVisibility = 'Public' | 'Private' | 'Enrolled';
export type CompletionRule = 'AllLessons' | 'MinimumLessons' | 'AnyLesson';

export interface ISection {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  order: number;
  status: SectionStatus;
  visibility: SectionVisibility;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  estimatedDuration: number; // minutes
  totalLessons: number;      // computed / cached counter
  completionRule: CompletionRule;
  minimumLessonsRequired: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISectionDocument extends ISection, Document {}
