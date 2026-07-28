import { Document, Types } from 'mongoose';

export type AssignmentStatus = 'Draft' | 'Published' | 'Closed' | 'Archived';
export type AssignmentVisibility = 'Public' | 'Private' | 'Enrolled';
export type SubmissionType =
  | 'TextSubmission'
  | 'FileUpload'
  | 'PDFUpload'
  | 'ImageUpload'
  | 'ZIPUpload'
  | 'ExternalUrl'
  | 'MultipleAttachments';

export interface IAssignmentAttachment {
  name?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface IAssignment {
  title: string;
  description?: string;
  instructions?: string;
  courseId: Types.ObjectId;
  unitId?: Types.ObjectId;
  sectionId?: Types.ObjectId;
  lessonId: Types.ObjectId;
  teacherId: Types.ObjectId;
  attachments?: IAssignmentAttachment[] | string[];
  totalMarks: number;
  passingMarks: number;
  submissionType: SubmissionType;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
  maxFiles?: number;
  maxAttempts?: number;
  allowLateSubmission: boolean;
  latePenaltyPercentage?: number;
  startDate?: Date;
  dueDate: Date;
  expiryDate?: Date;
  visibility?: AssignmentVisibility;
  status: AssignmentStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  estimatedDuration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssignmentDocument extends IAssignment, Document {}
