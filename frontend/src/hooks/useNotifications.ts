import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import { toast } from "react-hot-toast";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const NOTIFICATION_KEYS = queryKeys.notifications;

export function useNotifications(params?: { page?: number; type?: string; search?: string }) {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationService.getMyNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 30000, // Automatic polling every 30s
    placeholderData: keepPreviousData,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تفعيل القراءة للإشعار");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم تحديث كافة الإشعارات كمقروءة 🟢");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تفعيل قراءة الإشعارات");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم حذف الإشعار 🗑️");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر حذف الإشعار");
    },
  });

  return {
    notifications: notificationsQuery.data?.notifications || [],
    unreadCount: notificationsQuery.data?.unreadCount || 0,
    pagination: notificationsQuery.data?.pagination,
    isLoading: notificationsQuery.isPending,
    isFetching: notificationsQuery.isFetching,
    isRefetching: notificationsQuery.isRefetching,
    refetch: notificationsQuery.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
  };
}

export default useNotifications;
