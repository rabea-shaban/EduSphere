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
    staleTime: 1000 * 15, // 15 seconds
    refetchInterval: 20000, // Automatic polling every 20s
    placeholderData: keepPreviousData,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      queryClient.setQueriesData({ queryKey: queryKeys.notifications.all }, (oldData: any) => {
        if (!oldData || !oldData.notifications) return oldData;
        const target = oldData.notifications.find((n: any) => (n._id || n.id) === id);
        const wasUnread = target && !target.isRead;

        return {
          ...oldData,
          unreadCount: wasUnread ? Math.max(0, (oldData.unreadCount || 1) - 1) : oldData.unreadCount,
          notifications: oldData.notifications.map((n: any) =>
            (n._id || n.id) === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      handleApiError(err, "تعذر تحديث حالة الإشعار");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      queryClient.setQueriesData({ queryKey: queryKeys.notifications.all }, (oldData: any) => {
        if (!oldData || !oldData.notifications) return oldData;
        return {
          ...oldData,
          unreadCount: 0,
          notifications: oldData.notifications.map((n: any) => ({ ...n, isRead: true })),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم تحديث جميع الإشعارات كمقروءة");
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      handleApiError(err, "تعذر تحديث الإشعارات");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      queryClient.setQueriesData({ queryKey: queryKeys.notifications.all }, (oldData: any) => {
        if (!oldData || !oldData.notifications) return oldData;
        const target = oldData.notifications.find((n: any) => (n._id || n.id) === id);
        const wasUnread = target && !target.isRead;

        return {
          ...oldData,
          unreadCount: wasUnread ? Math.max(0, (oldData.unreadCount || 1) - 1) : oldData.unreadCount,
          notifications: oldData.notifications.filter((n: any) => (n._id || n.id) !== id),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
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
