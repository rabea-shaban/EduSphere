export interface StudentEnrolledCourse {
  enrollmentId: string;
  courseId: string | { _id: string; title: string; thumbnail?: string };
  courseTitle: string;
  progress: number;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  enrolledAt: string;
}

export interface TeacherStudent {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "Active" | "Suspended";
  createdAt: string;
  grade?: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  certificatesCount: number;
  averageProgress: number;
  averageQuizScore: number;
  averageAssignmentScore: number;
  courses: StudentEnrolledCourse[];
}

export interface TeacherStudentProfile extends TeacherStudent {
  statistics: {
    enrolledCoursesCount: number;
    completedCoursesCount: number;
    certificatesCount: number;
    averageProgress: number;
    averageQuizScore: number;
    averageAssignmentScore: number;
    quizzesCount: number;
    submissionsCount: number;
    studyHours: number;
  };
  enrollments: any[];
  attempts: any[];
  submissions: any[];
}

export interface StudentProgressMetrics {
  studentId: string;
  overallProgress: number;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  studyHours: number;
  studyStreakDays: number;
  enrollmentsProgress: {
    courseId: any;
    progress: number;
    status: string;
    updatedAt: string;
  }[];
}

export interface StudentCertificateItem {
  _id: string;
  courseId: any;
  courseTitle: string;
  issueDate: string;
  certificateCode: string;
  issuedByTeacher?: boolean;
}

export interface StudentActivityItem {
  type: "QuizAttempt" | "AssignmentSubmission" | "LessonCompletion" | "CertificateEarned";
  title: string;
  score?: number;
  grade?: number;
  date: string;
}

export interface TeacherStudentFilters {
  search?: string;
  courseId?: string;
  status?: "Active" | "Suspended" | "ALL" | "";
  progress?: "Completed" | "InProgress" | "ALL" | "";
  sort?: "highest_progress" | "lowest_progress" | "highest_quiz" | "newest" | "oldest";
  page?: number;
  limit?: number;
}
