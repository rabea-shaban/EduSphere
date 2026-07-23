import { Document, Types } from 'mongoose';

export type SubmissionStatus = 'Submitted' | 'Late' | 'Reviewed';

export interface ISubmission {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  attachments: string[]; // Submission document urls
  textAnswer?: string;
  submittedAt: Date;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubmissionDocument extends ISubmission, Document {}
