import { Document, Types } from 'mongoose';
import { EducationStage } from '../grades/grade.interface';

export interface ISubject {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  educationStage: EducationStage;
  grades: Types.ObjectId[];
  teacherIds: Types.ObjectId[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubjectDocument extends ISubject, Document {}
