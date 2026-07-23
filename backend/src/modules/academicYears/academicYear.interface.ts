import { Document } from 'mongoose';

export type AcademicYearStatus = 'ACTIVE' | 'INACTIVE' | 'PLANNED' | 'ARCHIVED';

export interface IAcademicYear {
  title: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: AcademicYearStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAcademicYearDocument extends IAcademicYear, Document {}
