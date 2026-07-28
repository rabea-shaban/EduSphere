import { Document, Types } from 'mongoose';

export type SubmissionStatus = 'Draft' | 'Submitted' | 'Late' | 'Reviewed' | 'Graded' | 'Returned';

export interface ISubmissionAttachment {
  name?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface ISubmission {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  attemptNumber: number;
  attachments?: ISubmissionAttachment[] | string[];
  textAnswer?: string;
  externalUrl?: string;
  submittedAt?: Date;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  privateNotes?: string;
  publicFeedback?: string;
  gradeOverride?: boolean;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubmissionDocument extends ISubmission, Document {}
