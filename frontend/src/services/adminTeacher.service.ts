import api from "./api";

export interface AdminTeacherItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isBlocked: boolean;
  status: "Active" | "Suspended";
  createdAt: string;
  nationalId?: string;
  subject: string;
  stage: string;
  experienceYears: number;
  degree?: string;
  university?: string;
  graduationYear?: number;
  bio?: string;
  coursesCount: number;
  studentsCount: number;
  revenue: number;
  averageRating: number;
}

export interface TeacherProfileDetail {
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
  application?: any;
  statistics: {
    coursesCount: number;
    studentsCount: number;
    lessonsCount: number;
    quizzesCount: number;
    assignmentsCount: number;
    totalRevenue: number;
    pendingRevenue: number;
    averageRating: number;
    completionRate: string;
  };
  financial: {
    totalRevenue: number;
    pendingRevenue: number;
    withdrawRequestsCount: number;
    preferredPaymentMethod: string;
  };
}

export interface GetTeachersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  stage?: string;
  subject?: string;
  sort?: string;
}

export interface GetTeachersResponse {
  teachers: AdminTeacherItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminTeacherService = {
  async getTeachers(params: GetTeachersQueryParams = {}): Promise<GetTeachersResponse> {
    const response = await api.get<{ success: boolean; data: GetTeachersResponse }>("/admin/teachers", {
      params,
    });
    return response.data.data;
  },

  async getTeacherById(id: string): Promise<TeacherProfileDetail> {
    const response = await api.get<{ success: boolean; data: TeacherProfileDetail }>(`/admin/teachers/${id}`);
    return response.data.data;
  },

  async getTeacherCourses(id: string): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: any[] }>(`/admin/teachers/${id}/courses`);
    return response.data.data;
  },

  async getTeacherRevenue(id: string): Promise<{ totalRevenue: number; payments: any[] }> {
    const response = await api.get<{ success: boolean; data: { totalRevenue: number; payments: any[] } }>(
      `/admin/teachers/${id}/revenue`
    );
    return response.data.data;
  },

  async updateTeacher(id: string, data: Partial<AdminTeacherItem>): Promise<AdminTeacherItem> {
    const response = await api.patch<{ success: boolean; data: AdminTeacherItem }>(`/admin/teachers/${id}`, data);
    return response.data.data;
  },

  async suspendTeacher(id: string): Promise<void> {
    await api.patch(`/admin/teachers/${id}/suspend`);
  },

  async activateTeacher(id: string): Promise<void> {
    await api.patch(`/admin/teachers/${id}/activate`);
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await api.patch(`/admin/teachers/${id}/reset-password`, { newPassword });
  },

  async deleteTeacher(id: string): Promise<void> {
    await api.delete(`/admin/teachers/${id}`);
  },

  async sendNotification(id: string, title: string, message: string): Promise<void> {
    await api.post(`/admin/teachers/${id}/notify`, { title, message });
  },
};

export default adminTeacherService;
