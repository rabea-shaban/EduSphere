import { Document, Types } from 'mongoose';

export type AttemptStatus = 'InProgress' | 'Submitted' | 'Graded';

export interface IExamAttempt {
  studentId: Types.ObjectId;
  quizId: Types.ObjectId;
  startedAt: Date;
  submittedAt?: Date;
  score: number;
  percentage: number;
  passed: boolean;
  status: AttemptStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExamAttemptDocument extends IExamAttempt, Document {}
