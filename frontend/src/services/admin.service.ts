import api from "./api";

export interface AdminDashboardResponse {
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
    monthlyGrowth: Array<{
      month: string;
      students: number;
      teachers: number;
      courses: number;
      revenue: number;
    }>;
    dailyActivity: Array<{
      day: string;
      signups: number;
      enrollments: number;
      totalActivity: number;
    }>;
  };
  recentTeacherApplications: Array<{
    _id: string;
    fullName: string;
    subject: string;
    stage: string;
    status: "Pending" | "UnderReview" | "Approved" | "Rejected";
    createdAt: string;
    phone?: string;
    email?: string;
  }>;
  recentPayments: Array<{
    _id: string;
    userId?: { firstName?: string; lastName?: string; email?: string; avatar?: string };
    courseId?: { title?: string };
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    role: string;
    avatar?: string;
    createdAt: string;
  }>;
  todoPanel: {
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
  notifications: {
    items: Array<{
      _id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      isRead: boolean;
      createdAt: string;
    }>;
    unreadCount: number;
  };
}

export const adminService = {
  async getDashboardData(): Promise<AdminDashboardResponse> {
    const response = await api.get<{ success: boolean; data: AdminDashboardResponse }>("/dashboard");
    return response.data.data;
  },

  async getUsers() {
    const response = await api.get("/users");
    return response.data.data;
  },

  async toggleUserStatus(userId: string, isFrozen: boolean) {
    const response = await api.patch(`/users/${userId}/status`, { isFrozen });
    return response.data;
  },

  async approvePayment(paymentId: string) {
    const response = await api.post(`/payments/${paymentId}/approve`);
    return response.data;
  },

  async rejectPayment(paymentId: string) {
    const response = await api.post(`/payments/${paymentId}/reject`);
    return response.data;
  },

  async approveTeacher(teacherId: string) {
    const response = await api.patch(`/teacher-applications/${teacherId}/status`, { status: "Approved" });
    return response.data;
  },

  async rejectTeacher(teacherId: string, rejectionReason?: string) {
    const response = await api.patch(`/teacher-applications/${teacherId}/status`, {
      status: "Rejected",
      rejectionReason: rejectionReason || "لم يتم استيفاء المستندات أو الشروط المطلوبة",
    });
    return response.data;
  },

  async broadcastNotification(notification: { targetGroup: string; title: string; message: string }) {
    const response = await api.post("/notifications/broadcast", notification);
    return response.data;
  },

  async createCoupon(couponData: { code: string; type: string; value: number; maxUsage: number }) {
    const response = await api.post("/coupons", couponData);
    return response.data;
  },
};

export default adminService;
