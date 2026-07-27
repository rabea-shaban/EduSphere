import api from "./api";
import { ApiResponse, ApiNotification } from "@/features/dashboard/types/api";

export interface NotificationsResponse {
  notifications: ApiNotification[];
  unreadCount: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const notificationService = {
  /**
   * Get notifications of logged-in user with filters, search, and pagination.
   */
  async getMyNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
    search?: string;
  }): Promise<NotificationsResponse> {
    const response = await api.get<ApiResponse<NotificationsResponse>>("/notifications", { params });
    return response.data.data;
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string): Promise<ApiNotification> {
    const response = await api.patch<ApiResponse<ApiNotification>>(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/mark-all-read");
  },

  /**
   * Delete a notification.
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;
