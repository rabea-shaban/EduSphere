import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherNotificationService from "@/services/teacherNotification.service";
import type { NotificationFilters } from "@/features/teacher/types/notification";
import { queryKeys, handleApiError } from "@/lib/react-query";

import { usePathname } from "next/navigation";

export const TEACHER_NOTIFICATION_KEYS = queryKeys.teacher.notifications;

export function useNotifications(filters?: NotificationFilters) {
  const pathname = usePathname();
  const isChatActive = Boolean(pathname?.includes("/chat"));
  return useQuery({
    queryKey: queryKeys.teacher.notifications(filters as Record<string, any>),
    queryFn: () => teacherNotificationService.getNotifications(filters),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: isChatActive ? false : 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Alias for components expecting useTeacherNotifications
export const useTeacherNotifications = useNotifications;

export function useNotificationDetail(id: string) {
  return useQuery({
    queryKey: ["teacher-notifications", "detail", id],
    queryFn: () => teacherNotificationService.getNotificationById(id),
    enabled: Boolean(id),
  });
}

export function useUnreadNotificationsCount() {
  const pathname = usePathname();
  const isChatActive = Boolean(pathname?.includes("/chat"));
  const { data } = useQuery({
    queryKey: queryKeys.notifications.header(),
    queryFn: () => teacherNotificationService.getNotifications({ isRead: false }),
    staleTime: 1000 * 30,
    refetchInterval: isChatActive ? false : 30 * 1000,
  });
  return data?.pagination?.total ?? 0;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث حالة الإشعار");
    },
  });
}

export const useMarkAsRead = useMarkNotificationAsRead;

export function useMarkNotificationAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherNotificationService.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث حالة الإشعار");
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teacherNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم تحديد جميع الإشعارات كمقروءة.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديد الإشعارات كمقروءة");
    },
  });
}

export const useMarkAllAsRead = useMarkAllNotificationsAsRead;

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherNotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم حذف الإشعار بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حذف الإشعار");
    },
  });
}

export function useBulkDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { notificationIds?: string[]; clearReadOnly?: boolean }) =>
      teacherNotificationService.bulkDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم مسح الإشعارات المحددة بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر مسح الإشعارات");
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.teacher.settings.notifications(),
    queryFn: () => teacherNotificationService.getPreferences(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: any) => teacherNotificationService.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.settings.notifications() });
      toast.success("تم حفظ إعدادات الإشعارات بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ إعدادات الإشعارات");
    },
  });
}

export function useNotificationAnalytics() {
  return useQuery({
    queryKey: ["teacher-notifications", "analytics"],
    queryFn: () => teacherNotificationService.getAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
}
