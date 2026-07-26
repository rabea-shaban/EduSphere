import api from "./api";

export interface TeacherDashboardResponse {
  myCoursesCount: number;
  totalStudents: number;
  quizzesCount: number;
  averageQuizScore: number;
  pendingAssignmentsToGrade: number;
}

export const teacherService = {
  async getDashboardData(): Promise<TeacherDashboardResponse> {
    const response = await api.get<{ success: boolean; data: TeacherDashboardResponse }>("/dashboard");
    return response.data.data;
  },

  async createCourse(courseData: any) {
    const response = await api.post("/courses", courseData);
    return response.data;
  },

  async createLesson(lessonData: any) {
    const response = await api.post("/lessons", lessonData);
    return response.data;
  },

  async createQuiz(quizData: any) {
    const response = await api.post("/quizzes", quizData);
    return response.data;
  },

  async requestWithdrawal(withdrawalData: { amount: number; payoutMethod: string; accountDetails: string }) {
    const response = await api.post("/payments/withdraw", withdrawalData);
    return response.data;
  },
};

export default teacherService;
