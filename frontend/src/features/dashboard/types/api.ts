/**
 * Backend-aligned TypeScript interfaces for the Student Dashboard API integration.
 * These match the actual Mongoose models and API response shapes from the backend.
 *
 * SEPARATE from the UI types in features/dashboard/types/index.ts which remain
 * for existing component props until full migration.
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
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  gender?: UserGender;
  dateOfBirth?: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ApiExamAttempt {
  _id: string;
  studentId: string;
  quizId: string | ApiQuiz;
  score: number;
  maxScore: number;
  passed: boolean;
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

export interface ApiSubmission {
  _id: string;
  assignmentId: string | ApiAssignment;
  studentId: string;
  fileUrl?: string;
  textContent?: string;
  status: "Pending" | "Submitted" | "Graded" | "Late";
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface ApiNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "quiz" | "course" | "achievement" | "system" | "assignment";
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
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
