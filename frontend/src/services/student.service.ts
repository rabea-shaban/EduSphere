import api from "./api";
import {
  ApiUser,
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateAvatarInput,
  ApiEnrollmentPopulated,
  ApiCourse,
  ApiProgress,
  ApiCourseProgress,
  UpdateProgressInput,
  ApiLesson,
  ApiQuiz,
  ApiExamAttempt,
  SubmitQuizInput,
  ApiAssignment,
  ApiSubmission,
  ApiNotification,
  GetNotificationsParams,
  ApiResponse,
  PaginatedResponse,
  ApiAchievementsData,
  ApiCheckInResult,
} from "@/features/dashboard/types/api";

export const studentService = {
  // ── Profile & Auth ────────────────────────────────────────────────────────
  async getProfile(): Promise<ApiUser> {
    const response = await api.get<ApiResponse<ApiUser>>("/auth/me");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileInput): Promise<ApiUser> {
    const payload: Record<string, any> = {};
    if (data.firstName && data.firstName.trim()) payload.firstName = data.firstName.trim();
    if (data.lastName && data.lastName.trim()) payload.lastName = data.lastName.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
    if (data.gender) payload.gender = data.gender;
    if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth;

    const response = await api.patch<ApiResponse<ApiUser>>("/auth/profile", payload);
    return response.data.data;
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await api.patch("/auth/change-password", data);
  },

  async updateAvatar(data: UpdateAvatarInput): Promise<ApiUser> {
    const response = await api.patch<ApiResponse<ApiUser>>("/auth/avatar", data);
    return response.data.data;
  },

  // ── Courses & Enrollments ──────────────────────────────────────────────────
  async getMyCourses(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ enrollments: ApiEnrollmentPopulated[]; pagination: PaginatedResponse<ApiEnrollmentPopulated>["pagination"] }> {
    const response = await api.get<ApiResponse<{ enrollments: ApiEnrollmentPopulated[]; pagination: any }>>("/enrollments/my-courses", {
      params,
    });
    return response.data.data;
  },

  async getCourseDetails(courseId: string): Promise<ApiCourse> {
    const response = await api.get<ApiResponse<ApiCourse>>(`/courses/${courseId}`);
    return response.data.data;
  },

  async enrollCourse(courseId: string, paymentStatus: string = "Free"): Promise<any> {
    const response = await api.post<ApiResponse<any>>("/enrollments/enroll", {
      courseId,
      paymentStatus,
    });
    return response.data.data;
  },

  async cancelEnrollment(enrollmentId: string): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/enrollments/${enrollmentId}/cancel`);
    return response.data.data;
  },

  // ── Progress & Lessons ────────────────────────────────────────────────────
  async getLessonDetails(lessonId: string): Promise<ApiLesson> {
    const response = await api.get<ApiResponse<ApiLesson>>(`/lessons/${lessonId}`);
    return response.data.data;
  },

  async getCourseLessons(courseId: string): Promise<ApiLesson[]> {
    const response = await api.get<ApiResponse<{ lessons: ApiLesson[] }>>("/lessons", {
      params: { courseId, limit: 100 },
    });
    return response.data.data.lessons;
  },

  async getCourseProgress(courseId: string): Promise<ApiCourseProgress> {
    const response = await api.get<ApiResponse<ApiCourseProgress>>(`/progress/course/${courseId}`);
    return response.data.data;
  },

  async updateProgress(data: UpdateProgressInput): Promise<ApiProgress> {
    const response = await api.post<ApiResponse<ApiProgress>>("/progress", data);
    return response.data.data;
  },

  // ── Quizzes & Exam Attempts ───────────────────────────────────────────────
  async getQuizzes(params?: { courseId?: string; lessonId?: string }): Promise<ApiQuiz[]> {
    const response = await api.get<ApiResponse<{ quizzes: ApiQuiz[] }>>("/quizzes", {
      params: { ...params, status: "Published", limit: 50 },
    });
    return response.data.data.quizzes;
  },

  async getQuizDetails(quizId: string): Promise<ApiQuiz> {
    const response = await api.get<ApiResponse<ApiQuiz>>(`/quizzes/${quizId}`);
    return response.data.data;
  },

  async startExamAttempt(quizId: string): Promise<ApiExamAttempt> {
    const response = await api.post<ApiResponse<ApiExamAttempt>>("/exam-attempts/start", { quizId });
    return response.data.data;
  },

  async submitExamAttempt(attemptId: string, answers: Array<{ questionId: string; studentAnswer: any }>): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/exam-attempts/${attemptId}/submit`, { answers });
    return response.data.data;
  },

  async getMyExamAttempts(quizId?: string): Promise<ApiExamAttempt[]> {
    const response = await api.get<ApiResponse<ApiExamAttempt[]>>("/exam-attempts/history", {
      params: { quizId },
    });
    return response.data.data;
  },

  // ── Assignments & Submissions ─────────────────────────────────────────────
  async getAssignments(params?: { courseId?: string; unitId?: string; lessonId?: string }): Promise<ApiAssignment[]> {
    const response = await api.get<ApiResponse<{ assignments: ApiAssignment[] }>>("/assignments", {
      params: { ...params, status: "Published", limit: 50 },
    });
    return response.data.data.assignments;
  },

  async getAssignmentDetails(assignmentId: string): Promise<ApiAssignment> {
    const response = await api.get<ApiResponse<ApiAssignment>>(`/assignments/${assignmentId}`);
    return response.data.data;
  },

  async submitAssignment(data: { assignmentId: string; attachments?: string[]; textAnswer?: string }): Promise<ApiSubmission> {
    const response = await api.post<ApiResponse<ApiSubmission>>("/submissions/submit", data);
    return response.data.data;
  },

  async getMySubmissions(assignmentId?: string): Promise<ApiSubmission[]> {
    const response = await api.get<ApiResponse<{ submissions: ApiSubmission[] }>>("/submissions/history", {
      params: { assignmentId, limit: 50 },
    });
    return response.data.data.submissions;
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  async getNotifications(params?: GetNotificationsParams): Promise<{ notifications: ApiNotification[]; unreadCount?: number; pagination?: any }> {
    const response = await api.get<ApiResponse<{ notifications: ApiNotification[]; unreadCount?: number; pagination: any }>>("/notifications", {
      params,
    });
    return response.data.data;
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await api.patch("/notifications/mark-all-read");
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  // ── Achievements & Gamification ───────────────────────────────────────────
  async getAchievements(): Promise<ApiAchievementsData> {
    const response = await api.get<ApiResponse<ApiAchievementsData>>("/progress/achievements");
    return response.data.data;
  },

  async dailyCheckIn(): Promise<ApiCheckInResult> {
    const response = await api.post<ApiResponse<ApiCheckInResult>>("/progress/checkin");
    return response.data.data;
  },
};

export default studentService;
