import api from "./api";

export interface AdminNotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: "Low" | "Medium" | "High";
  isRead: boolean;
  deliveryChannel: string[];
  createdAt: string;
  recipient: {
    _id: string;
    fullName: string;
    role?: string;
    avatar?: string;
  };
  sender: {
    _id: string;
    fullName: string;
  };
}

export interface NotificationSummary {
  totalNotifications: number;
  sentCount: number;
  unreadCount: number;
  readCount: number;
  readRate: string;
}

export interface GetNotificationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  priority?: string;
}

export interface GetNotificationsResponse {
  summary: NotificationSummary;
  notifications: AdminNotificationItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendBroadcastNotificationDto {
  title: string;
  message: string;
  type?: string;
  priority?: "Low" | "Medium" | "High";
  targetAudience?: "ALL" | "STUDENTS" | "TEACHERS" | "ADMINS";
  deliveryChannel?: string[];
}

export const adminNotificationService = {
  async getNotifications(params: GetNotificationsQueryParams = {}): Promise<GetNotificationsResponse> {
    const response = await api.get<{ success: boolean; data: GetNotificationsResponse }>("/admin/notifications", {
      params,
    });
    return response.data.data;
  },

  async sendBroadcastNotification(data: SendBroadcastNotificationDto): Promise<{ recipientsCount: number }> {
    const response = await api.post<{ success: boolean; data: { recipientsCount: number } }>(
      "/admin/notifications/send",
      data
    );
    return response.data.data;
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/admin/notifications/${id}`);
  },
};

export default adminNotificationService;
