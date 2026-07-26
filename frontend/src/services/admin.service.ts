import api from "./api";

export interface AdminDashboardResponse {
  totalOrganizations?: number;
  totalUsers: number;
  totalRevenue: number;
  activePlans: number;
  activeCourses: number;
  systemHealth: {
    status: string;
    uptime: number;
    memoryUsage: Record<string, number>;
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
    const response = await api.post(`/users/teachers/${teacherId}/approve`);
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
