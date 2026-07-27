import api from "./api";

export interface AdminStudentItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  isBlocked: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  lastLogin?: string;
  educationalSystem: string;
  educationalStage: string;
  grade: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  certificatesCount: number;
  averageQuizScore: number;
  level: number;
  xp: number;
}

export interface StudentProfileDetail {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  isBlocked: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  lastLogin?: string;
  educationalSystem: string;
  educationalStage: string;
  grade: string;
  guardian?: {
    name: string;
    phone: string;
    relation: string;
  };
  statistics: {
    enrolledCoursesCount: number;
    completedCoursesCount: number;
    certificatesCount: number;
    studyHours: number;
    learningProgress: number;
    averageQuizScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: string;
    quizzesCount: number;
    submissionsCount: number;
    xp: number;
    level: number;
  };
  enrollments: any[];
  attempts: any[];
  submissions: any[];
  payments: any[];
}

export interface GetStudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  stage?: string;
  grade?: string;
  system?: string;
  sort?: string;
}

export interface GetStudentsResponse {
  students: AdminStudentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminStudentService = {
  async getStudents(params: GetStudentsQueryParams = {}): Promise<GetStudentsResponse> {
    const response = await api.get<{ success: boolean; data: GetStudentsResponse }>("/admin/students", {
      params,
    });
    return response.data.data;
  },

  async getStudentById(id: string): Promise<StudentProfileDetail> {
    const response = await api.get<{ success: boolean; data: StudentProfileDetail }>(`/admin/students/${id}`);
    return response.data.data;
  },

  async getStudentCourses(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/students/${id}/courses`);
    return response.data.data;
  },

  async getStudentQuizzes(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/students/${id}/quizzes`);
    return response.data.data;
  },

  async getStudentAssignments(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/students/${id}/assignments`);
    return response.data.data;
  },

  async getStudentCertificates(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/students/${id}/certificates`);
    return response.data.data;
  },

  async getStudentPayments(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/students/${id}/payments`);
    return response.data.data;
  },

  async updateStudent(id: string, data: Partial<AdminStudentItem>): Promise<AdminStudentItem> {
    const response = await api.patch<{ success: boolean; data: AdminStudentItem }>(`/admin/students/${id}`, data);
    return response.data.data;
  },

  async suspendStudent(id: string): Promise<void> {
    await api.patch(`/admin/students/${id}/suspend`);
  },

  async activateStudent(id: string): Promise<void> {
    await api.patch(`/admin/students/${id}/activate`);
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await api.patch(`/admin/students/${id}/reset-password`, { newPassword });
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/admin/students/${id}`);
  },

  async sendNotification(id: string, title: string, message: string): Promise<void> {
    await api.post(`/admin/students/${id}/notify`, { title, message });
  },
};

export default adminStudentService;
