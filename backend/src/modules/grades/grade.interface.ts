import { Document } from 'mongoose';

export type EducationStage = 'Primary' | 'Preparatory' | 'Secondary';

export interface IGradeName {
  ar: string;
  en: string;
}

export interface IGrade {
  name: IGradeName;
  order: number;
  educationStage: EducationStage;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGradeDocument extends IGrade, Document {}
