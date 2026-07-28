export type NotificationTypeCategory =
  | "Course"
  | "Lesson"
  | "Assignment"
  | "Quiz"
  | "Exam"
  | "Payment"
  | "Announcement"
  | "System"
  | "Chat";

export type NotificationPriority = "Low" | "Medium" | "High";

export interface TeacherNotificationItem {
  _id: string;
  recipientId: string;
  senderId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
  } | string;
  title: string;
  message: string;
  type: NotificationTypeCategory;
  priority: NotificationPriority;
  deliveryChannel: ("InApp" | "Push" | "Email" | "SMS")[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherNotificationsListResponse {
  notifications: TeacherNotificationItem[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotificationPreferences {
  _id?: string;
  userId?: string;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  categories: {
    courseEnrollments: boolean;
    assignments: boolean;
    quizzes: boolean;
    reviews: boolean;
    paymentsAndWithdrawals: boolean;
    systemAnnouncements: boolean;
    securityAlerts: boolean;
  };
  frequency: "INSTANT" | "DAILY_DIGEST" | "WEEKLY_DIGEST";
}

export interface NotificationAnalyticsData {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  readRatioPercentage: number;
  typeBreakdown: {
    course: number;
    assignment: number;
    quiz: number;
    payment: number;
    system: number;
  };
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationTypeCategory | "ALL" | "";
  search?: string;
  page?: number;
  limit?: number;
}
