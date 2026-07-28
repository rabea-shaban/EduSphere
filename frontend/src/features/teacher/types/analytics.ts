export type AnalyticsPeriod =
  | "today"
  | "yesterday"
  | "7days"
  | "30days"
  | "90days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear";

export interface AnalyticsFilters {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  courseId?: string;
  category?: string;
}

export interface DashboardAnalyticsData {
  courses: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  students: {
    total: number;
    certificatesIssued: number;
  };
  content: {
    lessons: number;
    quizzes: number;
    assignments: number;
  };
  quizzes: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
  };
  assignments: {
    totalSubmissions: number;
    averageScore: number;
  };
  revenue: {
    grossRevenue: number;
    teacherRevenue: number;
    currency: string;
  };
  period: string;
}

export interface CourseAnalyticsItem {
  _id: string;
  title: string;
  status: string;
  category: string;
  price: number;
  rating: number;
  studentsCount: number;
  completedCount: number;
  completionRate: number;
  revenue: number;
}

export interface StudentAnalyticsData {
  totalStudents: number;
  activeStudents: number;
  newStudents: number;
  completedStudents: number;
  retentionRate: number;
}

export interface LessonAnalyticsItem {
  _id: string;
  title: string;
  courseTitle: string;
  lessonType: string;
  durationMinutes: number;
  viewsCount: number;
  completionRate: number;
}

export interface QuizAnalyticsData {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  failRate: number;
  passCount: number;
  failCount: number;
}

export interface AssignmentAnalyticsData {
  totalAssignments: number;
  totalSubmissions: number;
  pendingReviewCount: number;
  gradedCount: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  lateSubmissionRate: number;
}

export interface RevenueAnalyticsData {
  grossRevenue: number;
  teacherShare: number;
  totalTransactions: number;
  monthlyRevenue: {
    _id: string;
    total: number;
    count: number;
  }[];
}

export interface EngagementAnalyticsData {
  dailyActiveStudents: number;
  weeklyActiveStudents: number;
  monthlyActiveStudents: number;
  averageSessionMinutes: number;
  completionRate: number;
}

export interface CertificateAnalyticsData {
  certificatesIssued: number;
  certificatesPending: number;
  completionRate: number;
}

export interface ChartMonthSeries {
  month: string;
  students: number;
  revenue: number;
  avgQuizScore: number;
}
