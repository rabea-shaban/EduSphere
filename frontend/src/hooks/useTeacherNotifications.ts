import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherNotificationService from "@/services/teacherNotification.service";
import type { NotificationFilters, NotificationPreferences } from "@/features/teacher/types/notification";

export const TEACHER_NOTIFICATION_KEYS = {
  all: ["teacher-notifications"] as const,
  list: (filters?: NotificationFilters) => ["teacher-notifications", "list", filters] as const,
  preferences: ["teacher-notifications", "preferences"] as const,
  analytics: ["teacher-notifications", "analytics"] as const,
};

export function useTeacherNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: TEACHER_NOTIFICATION_KEYS.list(filters),
    queryFn: () => teacherNotificationService.getNotifications(filters),
    staleTime: 1000 * 30, // 30s auto-refresh interval for notifications
    refetchInterval: 30000,
  });
}

export function useUnreadNotificationsCount() {
  const { data } = useTeacherNotifications({ isRead: false, limit: 1 });
  return data?.unreadCount || 0;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_NOTIFICATION_KEYS.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_NOTIFICATION_KEYS.all });
      toast.success("تم تحديد جميع الإشعارات كمقروءة");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديد الإشعارات كمقروءة");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherNotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_NOTIFICATION_KEYS.all });
      toast.success("تم حذف الإشعار بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف الإشعار");
    },
  });
}

export function useBulkDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { notificationIds?: string[]; clearReadOnly?: boolean }) =>
      teacherNotificationService.bulkDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_NOTIFICATION_KEYS.all });
      toast.success("تم مسح الإشعارات المحددة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر مسح الإشعارات");
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: TEACHER_NOTIFICATION_KEYS.preferences,
    queryFn: () => teacherNotificationService.getPreferences(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NotificationPreferences>) =>
      teacherNotificationService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_NOTIFICATION_KEYS.preferences });
      toast.success("تم تحديث إعدادات وتفضيلات الإشعارات بنجاح ⚙️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث إعدادات الإشعارات");
    },
  });
}

export function useNotificationAnalytics() {
  return useQuery({
    queryKey: TEACHER_NOTIFICATION_KEYS.analytics,
    queryFn: () => teacherNotificationService.getAnalytics(),
    staleTime: 1000 * 60 * 3,
  });
}
