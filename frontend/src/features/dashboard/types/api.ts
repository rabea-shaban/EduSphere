/**
 * Backend-aligned TypeScript interfaces for the Student Dashboard API integration.
 * These match the actual Mongoose models and API response shapes from the backend.
 */

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ─── User / Profile ───────────────────────────────────────────────────────────
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
export type UserGender = "MALE" | "FEMALE" | "OTHER";

export interface ApiUser {
  _id: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: UserGender;
  dateOfBirth?: string;
  role: UserRole | string;
  isVerified?: boolean;
  isBlocked?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: UserGender;
  dateOfBirth?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAvatarInput {
  avatar: string;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────
export type EnrollmentStatus = "Pending" | "Active" | "Completed" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Free";

export interface ApiEnrollment {
  _id: string;
  studentId: string;
  courseId: ApiCourse | string;
  teacherId: ApiTeacherSummary | string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  purchasePrice: number;
  enrolledAt: string;
  completedAt?: string;
  certificateIssued: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnrollmentPopulated extends Omit<ApiEnrollment, "courseId" | "teacherId"> {
  courseId: ApiCourse;
  teacherId: ApiTeacherSummary;
}

// ─── Course ───────────────────────────────────────────────────────────────────
export interface ApiCourse {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  isFree: boolean;
  isFeatured?: boolean;
  status: "Draft" | "Published" | "Archived";
  enrollmentCount: number;
  lessonCount?: number;
  duration?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
  subject?: ApiSubject | string;
  teacher?: ApiTeacherSummary | string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSubject {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export interface ApiTeacherSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface ApiProgress {
  _id: string;
  studentId: string;
  courseId: string;
  lessonId: string | ApiLessonSummary;
  videoProgress: number;
  watchTime: number;
  completed: boolean;
  completedAt?: string;
  lastPosition: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCourseProgress {
  completionPercentage: number;
  completedLessons: number;
  totalLessons: number;
  progressLogs: ApiProgress[];
}

export interface UpdateProgressInput {
  courseId: string;
  lessonId: string;
  watchTime?: number;
  videoProgress?: number;
  completed?: boolean;
  lastPosition?: number;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────
export interface ApiLessonSummary {
  _id: string;
  title: string;
  slug: string;
  lessonType: "Video" | "Live" | "Article" | "Quiz";
  duration?: number;
  order: number;
}

export interface ApiLesson extends ApiLessonSummary {
  description?: string;
  videoUrl?: string;
  courseId: string;
  unitId?: string;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Quiz / Exam Attempts ─────────────────────────────────────────────────────
export interface ApiQuiz {
  _id: string;
  title: string;
  description?: string;
  courseId: string | ApiCourse;
  duration: number;         // minutes
  passingScore: number;     // percentage
  totalQuestions: number;
  attemptsAllowed: number;
  status: "Draft" | "Published" | "Archived";
  dueDate?: string;
  questions?: any[];
  createdAt: string;
  updatedAt: string;
}

export type AttemptStatus = "InProgress" | "Submitted" | "Graded";

export interface ApiExamAttempt {
  _id: string;
  studentId: string;
  quizId: string | ApiQuiz;
  score: number;
  percentage?: number;
  rank?: number;
  maxScore: number;
  passed: boolean;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  answers?: ApiAnswerSubmission[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiAnswerSubmission {
  questionId: string;
  selectedOption?: string;
  textAnswer?: string;
  isCorrect?: boolean;
}

export interface SubmitQuizInput {
  quizId: string;
  answers: ApiAnswerSubmission[];
}

// ─── Assignment / Submission ───────────────────────────────────────────────────
export interface ApiAssignment {
  _id: string;
  title: string;
  description?: string;
  courseId: string | ApiCourse;
  dueDate?: string;
  maxGrade?: number;
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "Pending" | "Submitted" | "Graded" | "Late" | "Reviewed";

export interface ApiSubmission {
  _id: string;
  assignmentId: string | ApiAssignment;
  studentId: string;
  fileUrl?: string;
  textContent?: string;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type ApiNotificationType =
  | "Course"
  | "Lesson"
  | "Assignment"
  | "Quiz"
  | "Exam"
  | "Payment"
  | "Announcement"
  | "System"
  | "Chat"
  | "achievement";

export interface ApiNotification {
  _id: string;
  recipientId: string;
  senderId?: { _id: string; firstName: string; lastName: string; avatar?: string } | string;
  title: string;
  message: string;
  type: ApiNotificationType | string;
  priority?: "Low" | "Medium" | "High";
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
  search?: string;
}

// ─── Generic API Response wrapper ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// ─── Section ───────────────────────────────────────────────────────────────────
export type ApiSectionStatus = 'Draft' | 'Published' | 'Hidden' | 'Archived';
export type ApiSectionVisibility = 'Public' | 'Private' | 'Enrolled';
export type ApiCompletionRule = 'AllLessons' | 'MinimumLessons' | 'AnyLesson';

export interface ApiSection {
  _id: string;
  title: string;
  description?: string;
  courseId: string | { _id: string; title: string; slug: string };
  order: number;
  status: ApiSectionStatus;
  visibility: ApiSectionVisibility;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  estimatedDuration: number;
  totalLessons: number;
  completionRule: ApiCompletionRule;
  minimumLessonsRequired: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Lesson ────────────────────────────────────────────────────────────────────
export type ApiLessonType =
  | 'Video'
  | 'Article'
  | 'Live'
  | 'PDF'
  | 'Resource'
  | 'Interactive'
  | 'Quiz'
  | 'Assignment'
  | 'Text';

export type ApiLessonStatus = 'Draft' | 'Published' | 'Scheduled' | 'Hidden' | 'Archived';
export type ApiLessonVisibility = 'Public' | 'Private' | 'Enrolled';
export type ApiCompletionRequirement = 'Watch75' | 'Watch100' | 'PassQuiz' | 'SubmitAssignment' | 'Manual';


