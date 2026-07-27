export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  stage: string;
  grade: string;
  system: string;
  stream: string;
  streakDays: number;
  xpPoints: number;
  level: number;
  totalStudyHours: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  earnedCertificatesCount: number;
}

export interface DashboardStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  iconName: string;
  colorScheme: "navy" | "orange" | "blue" | "emerald" | "amber" | "purple";
}

export interface EnrolledCourse {
  id: string;
  title: string;
  subject: string;
  stage: string;
  teacherName: string;
  teacherAvatar: string;
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
  nextLessonTitle: string;
  coverImage: string;
  isFeatured?: boolean;
  category: "cs" | "general" | "azhari" | "baccalaureate";
}

export interface LessonAttachment {
  id: string;
  title: string;
  fileSize: string;
  fileType: "pdf" | "zip" | "code" | "docx";
  downloadUrl: string;
}

export interface LessonComment {
  id: string;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  content: string;
  likesCount: number;
  isTeacherReply?: boolean;
}

export interface LessonDetails {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
  totalCourseLessons: number;
  description: string;
  attachments: LessonAttachment[];
  notes: string;
  comments: LessonComment[];
  prevLessonId?: string;
  nextLessonId?: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  courseName: string;
  totalQuestions: number;
  durationMinutes: number;
  dueDate: string;
  status: "available" | "completed" | "upcoming";
  score?: number;
  maxScore?: number;
  attemptsLeft?: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  courseName: string;
  deadline: string;
  status: "pending" | "submitted" | "graded" | "late";
  submissionDate?: string;
  grade?: string;
  feedback?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercentage: number;
  xpReward: number;
  category: "learning" | "streak" | "cs" | "quiz";
}

export interface CertificateItem {
  id: string;
  courseTitle: string;
  teacherName: string;
  issueDate: string;
  grade: string;
  certificateCode: string;
  pdfUrl: string;
  thumbnailUrl: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "quiz" | "course" | "achievement" | "system" | "assignment" | "payment" | "announcement" | "lesson" | string;
  actionUrl?: string;
}
