import { Document, Types } from 'mongoose';

export type AssignmentStatus = 'Draft' | 'Published' | 'Closed';

export interface IAssignment {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  unitId: Types.ObjectId;
  lessonId: Types.ObjectId;
  teacherId: Types.ObjectId;
  attachments: string[]; // file urls/paths
  instructions?: string;
  totalMarks: number;
  passingMarks: number;
  allowLateSubmission: boolean;
  startDate: Date;
  dueDate: Date;
  status: AssignmentStatus;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssignmentDocument extends IAssignment, Document {}
