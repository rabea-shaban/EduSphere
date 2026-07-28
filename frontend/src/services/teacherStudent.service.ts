import api from "./api";
import type {
  TeacherStudent,
  TeacherStudentProfile,
  StudentProgressMetrics,
  StudentCertificateItem,
  StudentActivityItem,
  TeacherStudentFilters,
} from "@/features/teacher/types/student";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface TeacherStudentsListResponse {
  students: TeacherStudent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const teacherStudentService = {
  /**
   * Get students enrolled in courses taught by the teacher.
   */
  async getStudents(filters?: TeacherStudentFilters): Promise<TeacherStudentsListResponse> {
    const response = await api.get<ApiResponse<TeacherStudentsListResponse>>(
      `/teacher/students`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get student profile & metrics within teacher's courses.
   */
  async getStudentById(id: string): Promise<TeacherStudentProfile> {
    const response = await api.get<ApiResponse<TeacherStudentProfile>>(
      `/teacher/students/${id}`
    );
    return response.data.data;
  },

  /**
   * Get student learning progress.
   */
  async getStudentProgress(id: string): Promise<StudentProgressMetrics> {
    const response = await api.get<ApiResponse<StudentProgressMetrics>>(
      `/teacher/students/${id}/progress`
    );
    return response.data.data;
  },

  /**
   * Get student enrollments for teacher's courses.
   */
  async getStudentEnrollments(id: string): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `/teacher/students/${id}/enrollments`
    );
    return response.data.data;
  },

  /**
   * Get student quiz attempts for teacher's quizzes.
   */
  async getStudentQuizzes(id: string): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `/teacher/students/${id}/quizzes`
    );
    return response.data.data;
  },

  /**
   * Get student assignment submissions for teacher's assignments.
   */
  async getStudentAssignments(id: string): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(
      `/teacher/students/${id}/assignments`
    );
    return response.data.data;
  },

  /**
   * Get student certificates earned in teacher's courses.
   */
  async getStudentCertificates(id: string): Promise<StudentCertificateItem[]> {
    const response = await api.get<ApiResponse<StudentCertificateItem[]>>(
      `/teacher/students/${id}/certificates`
    );
    return response.data.data;
  },

  /**
   * Issue a certificate to student for a course.
   */
  async issueCertificate(id: string, courseId: string): Promise<StudentCertificateItem> {
    const response = await api.post<ApiResponse<StudentCertificateItem>>(
      `/teacher/students/${id}/certificates`,
      { courseId }
    );
    return response.data.data;
  },

  /**
   * Get student activity timeline.
   */
  async getStudentActivity(id: string): Promise<StudentActivityItem[]> {
    const response = await api.get<ApiResponse<StudentActivityItem[]>>(
      `/teacher/students/${id}/activity`
    );
    return response.data.data;
  },

  /**
   * Send notification / announcement to student.
   */
  async sendNotification(
    id: string,
    data: { title: string; message: string }
  ): Promise<any> {
    const response = await api.post<ApiResponse<any>>(
      `/teacher/students/${id}/notify`,
      data
    );
    return response.data.data;
  },
};

export default teacherStudentService;
