import api from "./api";
import { ApiResponse, ApiUser } from "@/features/dashboard/types/api";

export interface AdminDashboardData {
  welcome: {
    adminName: string;
    role: string;
    currentDate: string;
    lastLogin?: string;
  };
  statistics: {
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalUsers: number;
    pendingTeacherApps: number;
    totalCourses: number;
    publishedCourses: number;
    totalQuizzes: number;
    activeSubscriptions: number;
    totalRevenue: number;
    pendingPayments: number;
    withdrawalRequests: number;
  };
  analyticsCharts: {
    monthlyGrowth: Array<{ month: string; students: number; teachers: number; courses: number; revenue: number }>;
    dailyActivity: Array<{ day: string; signups: number; enrollments: number; totalActivity: number }>;
  };
  recentTeacherApplications: any[];
  recentPayments: any[];
  recentUsers: any[];
  todoPanel?: {
    pendingTeacherApps: number;
    pendingPayments: number;
    pendingWithdrawRequests: number;
    pendingCourseReviews: number;
  };
  systemHealth: {
    status: string;
    dbStatus: string;
    uptimeSeconds: number;
    uptimeFormatted: string;
    memoryUsageMB: string;
  };
  notifications?: {
    items: any[];
    unreadCount: number;
  };
}

export type AdminDashboardResponse = AdminDashboardData;

export const adminService = {
  /**
   * Fetch Super Admin Dashboard Analytics Data.
   */
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await api.get<ApiResponse<AdminDashboardData>>("/dashboard");
    return response.data.data;
  },

  /**
   * Approve teacher application.
   */
  async approveTeacher(applicationId: string): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/teacher-applications/${applicationId}/status`, { status: "Approved" });
    return response.data.data;
  },

  /**
   * Reject teacher application.
   */
  async rejectTeacher(applicationId: string, reason?: string): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/teacher-applications/${applicationId}/status`, { status: "Rejected", rejectionReason: reason });
    return response.data.data;
  },

  /**
   * Approve payment.
   */
  async approvePayment(paymentId: string): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/payments/${paymentId}/status`, { status: "Paid" });
    return response.data.data;
  },

  /**
   * Fetch users list filtered by role (STUDENT, TEACHER, ADMIN) with search.
   */
  async getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<{ users: ApiUser[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ users: ApiUser[]; pagination: any }>>("/users", { params });
    return response.data.data;
  },

  /**
   * Toggle user block/suspend status.
   */
  async updateUserStatus(userId: string, isBlocked: boolean): Promise<ApiUser> {
    const response = await api.patch<ApiResponse<ApiUser>>(`/users/${userId}`, { isBlocked });
    return response.data.data;
  },

  /**
   * Delete a user account (Admin).
   */
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  /**
   * Fetch all platform courses with status filter and search.
   */
  async getCourses(params?: { status?: string; search?: string; page?: number; limit?: number }): Promise<{ courses: any[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ courses: any[]; pagination: any }>>("/courses", { params });
    return response.data.data;
  },

  /**
   * Update course status (Publish, Archive, Draft).
   */
  async updateCourseStatus(courseId: string, status: "Published" | "Draft" | "Archived"): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/courses/${courseId}`, { status });
    return response.data.data;
  },

  /**
   * Delete a course (Admin).
   */
  async deleteCourse(courseId: string): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  },

  /**
   * Fetch platform payments and subscriptions.
   */
  async getPayments(params?: { status?: string; page?: number; limit?: number }): Promise<{ payments: any[]; pagination: any }> {
    const response = await api.get<ApiResponse<{ payments: any[]; pagination: any }>>("/payments", { params });
    return response.data.data;
  },

  /**
   * Update payment status.
   */
  async updatePaymentStatus(paymentId: string, status: "Paid" | "Failed" | "Refunded"): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(`/payments/${paymentId}/status`, { status });
    return response.data.data;
  },
};

export default adminService;
