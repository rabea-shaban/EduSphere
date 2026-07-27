import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import { toast } from "react-hot-toast";

export const NOTIFICATION_KEYS = {
  all: ["notifications"],
  my: (page?: number, type?: string, search?: string) => [
    "notifications",
    "my",
    page ?? 1,
    type ?? "all",
    search ?? "",
  ],
};

export function useNotifications(params?: { page?: number; type?: string; search?: string }) {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATION_KEYS.my(params?.page, params?.type, params?.search),
    queryFn: () => notificationService.getMyNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 30000, // Automatic polling every 30s
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تفعيل القراءة للإشعار");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      toast.success("تم تحديث كافة الإشعارات كمقروءة 🟢");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تفعيل قراءة الإشعارات");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      toast.success("تم حذف الإشعار 🗑️");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر حذف الإشعار");
    },
  });

  return {
    notifications: notificationsQuery.data?.notifications || [],
    unreadCount: notificationsQuery.data?.unreadCount || 0,
    pagination: notificationsQuery.data?.pagination,
    isLoading: notificationsQuery.isLoading,
    isRefetching: notificationsQuery.isRefetching,
    refetch: notificationsQuery.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
  };
}

export default useNotifications;
