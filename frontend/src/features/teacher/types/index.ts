export interface TeacherProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  stage: string;
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  totalLessons: number;
  totalQuizzes: number;
  averageRating: number;
  totalReviewsCount: number;
  experienceYears: number;
  qualifications: string[];
  subjects: string[];
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface TeacherStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  iconName: string;
  colorScheme: "navy" | "orange" | "blue" | "emerald" | "amber" | "purple";
}

export interface InstructorCourse {
  id: string;
  title: string;
  category: "cs" | "general" | "azhari" | "baccalaureate";
  subject: string;
  stage: string;
  price: number;
  status: "published" | "draft" | "archived";
  enrolledStudents: number;
  totalLessons: number;
  totalQuizzes: number;
  rating: number;
  reviewsCount: number;
  revenue: number;
  coverImage: string;
  createdAt: string;
}

export interface CourseOrder {
  id: string;
  orderNumber: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  amount: number;
  date: string;
  paymentMethod: "Vodafone Cash" | "Fawry" | "Visa / MasterCard";
  status: "completed" | "pending" | "refunded";
}

export interface ReviewItem {
  id: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  replyText?: string;
}

export interface SubmissionReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  assignmentTitle: string;
  courseTitle: string;
  submissionDate: string;
  fileUrl: string;
  fileName: string;
  status: "pending" | "graded";
  score?: number;
  maxScore: number;
  feedback?: string;
}

export interface TeacherNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "order" | "submission" | "review" | "system";
}
