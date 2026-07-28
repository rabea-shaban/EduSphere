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

export type SubmissionStatus = 'Draft' | 'Submitted' | 'Late' | 'Reviewed' | 'Graded' | 'Returned';

export interface ApiAssignmentAttachment {
  name?: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface ApiAssignment {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  courseId?: string | { _id: string; title: string; slug: string };
  unitId?: string | { _id: string; title: string };
  sectionId?: string | { _id: string; title: string };
  lessonId?: string | { _id: string; title: string };
  teacherId?: string | { _id: string; firstName?: string; lastName?: string; email?: string };
  attachments?: ApiAssignmentAttachment[] | string[];
  totalMarks: number;
  passingMarks: number;
  submissionType: SubmissionType;
  allowedFileTypes?: string[];
  maxFileSizeMB: number;
  maxFiles: number;
  maxAttempts: number;
  allowLateSubmission: boolean;
  latePenaltyPercentage: number;
  startDate?: string;
  dueDate: string;
  expiryDate?: string;
  visibility: AssignmentVisibility;
  status: AssignmentStatus;
  isDeleted: boolean;
  deletedAt?: string;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface ApiSubmission {
  _id: string;
  assignmentId: string | ApiAssignment;
  studentId: string | { _id: string; firstName?: string; lastName?: string; username?: string; email?: string; avatar?: string };
  attemptNumber: number;
  attachments?: ApiAssignmentAttachment[] | string[];
  textAnswer?: string;
  externalUrl?: string;
  submittedAt: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  privateNotes?: string;
  publicFeedback?: string;
  gradeOverride?: boolean;
  reviewedBy?: string | { _id: string; firstName?: string; lastName?: string };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  instructions?: string;
  courseId: string;
  sectionId?: string;
  unitId?: string;
  lessonId: string;
  teacherId?: string;
  attachments?: ApiAssignmentAttachment[] | string[];
  totalMarks?: number;
  passingMarks?: number;
  submissionType?: SubmissionType;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
  maxFiles?: number;
  maxAttempts?: number;
  allowLateSubmission?: boolean;
  latePenaltyPercentage?: number;
  startDate?: string;
  dueDate: string;
  expiryDate?: string;
  visibility?: AssignmentVisibility;
  status?: AssignmentStatus;
  estimatedDuration?: number;
}

export interface UpdateAssignmentInput extends Partial<CreateAssignmentInput> {}

export interface GradeSubmissionInput {
  grade: number;
  feedback?: string;
  privateNotes?: string;
  publicFeedback?: string;
  gradeOverride?: boolean;
}

export interface AssignmentAnalytics {
  assignmentId: string;
  assignmentTitle: string;
  totalMarks: number;
  passingMarks: number;
  submissionsCount: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passCount: number;
  failCount: number;
  passRate: number;
  failureRate: number;
  lateCount: number;
  lateSubmissionRate: number;
}

export interface AssignmentFilters {
  search?: string;
  status?: AssignmentStatus | 'ALL' | '';
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
