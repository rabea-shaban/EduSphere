import api from "./api";
import type {
  TeacherNotificationsListResponse,
  TeacherNotificationItem,
  NotificationPreferences,
  NotificationAnalyticsData,
  NotificationFilters,
} from "@/features/teacher/types/notification";
import type { ApiResponse } from "@/features/dashboard/types/api";

export const teacherNotificationService = {
  /**
   * Get teacher notifications with search, type filter, and read/unread status.
   */
  async getNotifications(filters?: NotificationFilters): Promise<TeacherNotificationsListResponse> {
    const response = await api.get<ApiResponse<TeacherNotificationsListResponse>>(
      `/teacher/notifications`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get single notification details.
   */
  async getNotificationById(id: string): Promise<TeacherNotificationItem> {
    const response = await api.get<ApiResponse<TeacherNotificationItem>>(
      `/teacher/notifications/${id}`
    );
    return response.data.data;
  },

  /**
   * Mark a notification as read.
   */
  async markAsRead(id: string): Promise<TeacherNotificationItem> {
    const response = await api.patch<ApiResponse<TeacherNotificationItem>>(
      `/teacher/notifications/${id}/read`
    );
    return response.data.data;
  },

  /**
   * Mark a notification as unread.
   */
  async markAsUnread(id: string): Promise<TeacherNotificationItem> {
    const response = await api.patch<ApiResponse<TeacherNotificationItem>>(
      `/teacher/notifications/${id}/unread`
    );
    return response.data.data;
  },

  /**
   * Mark all teacher notifications as read.
   */
  async markAllAsRead(): Promise<void> {
    await api.patch(`/teacher/notifications/read-all`);
  },

  /**
   * Delete a single notification.
   */
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/teacher/notifications/${id}`);
  },

  /**
   * Bulk delete notifications or clear read notifications.
   */
  async bulkDelete(data: { notificationIds?: string[]; clearReadOnly?: boolean }): Promise<void> {
    await api.delete(`/teacher/notifications`, { data });
  },

  /**
   * Get teacher notification preferences.
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<ApiResponse<NotificationPreferences>>(
      `/teacher/notifications/preferences`
    );
    return response.data.data;
  },

  /**
   * Update teacher notification preferences.
   */
  async updatePreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.put<ApiResponse<NotificationPreferences>>(
      `/teacher/notifications/preferences`,
      data
    );
    return response.data.data;
  },

  /**
   * Get notification analytics for teacher dashboard.
   */
  async getAnalytics(): Promise<NotificationAnalyticsData> {
    const response = await api.get<ApiResponse<NotificationAnalyticsData>>(
      `/teacher/notifications/analytics`
    );
    return response.data.data;
  },
};

export default teacherNotificationService;
