export type SocketConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface RealtimeEventPayload<T = any> {
  type: string;
  title: string;
  message: string;
  data?: T;
  timestamp: string;
}

export interface StudentEnrolledEvent {
  studentName: string;
  courseTitle: string;
  courseId: string;
  amount?: number;
}

export interface PaymentCompletedEvent {
  amount: number;
  courseTitle: string;
  studentName: string;
  netEarnings: number;
}

export interface AssignmentSubmittedEvent {
  assignmentTitle: string;
  studentName: string;
  assignmentId: string;
  submissionId: string;
}

export interface QuizSubmittedEvent {
  quizTitle: string;
  studentName: string;
  score: number;
  totalMarks: number;
}

export interface ReviewCreatedEvent {
  courseTitle: string;
  studentName: string;
  rating: number;
  comment?: string;
}

export interface WithdrawalUpdatedEvent {
  withdrawalId: string;
  amount: number;
  status: string;
}

export interface FileUploadProgressEvent {
  fileId: string;
  progressPercentage: number;
}
