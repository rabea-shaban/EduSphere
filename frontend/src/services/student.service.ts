import api from "./api";

export interface StudentDashboardResponse {
  myCoursesCount: number;
  learningProgress: number;
  upcomingExams: Array<{ id: string; title: string; endDate: string; duration: number }>;
  pendingAssignmentsCount: number;
  certificatesEarned: number;
  studyStreak: number;
}

export const studentService = {
  async getDashboardData(): Promise<StudentDashboardResponse> {
    const response = await api.get<{ success: boolean; data: StudentDashboardResponse }>("/dashboard");
    return response.data.data;
  },

  async getCourses() {
    const response = await api.get("/courses");
    return response.data.data;
  },

  async getLessonDetails(lessonId: string) {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data.data;
  },

  async submitAssignment(assignmentId: string, formData: FormData) {
    const response = await api.post(`/submissions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async submitQuizAnswers(quizId: string, answers: any[]) {
    const response = await api.post(`/exam-attempts`, { quizId, answers });
    return response.data;
  },
};

export default studentService;
