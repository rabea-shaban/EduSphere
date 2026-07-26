import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "@/services/admin.service";
import { toast } from "react-hot-toast";

export const ADMIN_KEYS = {
  dashboard: ["admin", "dashboard"],
  users: ["admin", "users"],
};

export function useAdmin() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ADMIN_KEYS.dashboard,
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 60 * 3,
  });

  const usersQuery = useQuery({
    queryKey: ADMIN_KEYS.users,
    queryFn: () => adminService.getUsers(),
  });

  const approvePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => adminService.approvePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم اعتماد عملية الدفع وتفعيل الكورس للطالب فوراً! ✅");
    },
  });

  const approveTeacherMutation = useMutation({
    mutationFn: (teacherId: string) => adminService.approveTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم اعتماد المعلم بنجاح وتفعيل حسابه على منصة EduSphere! 🎉");
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: (data: { targetGroup: string; title: string; message: string }) =>
      adminService.broadcastNotification(data),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار الشامل للمستهدفين بنجاح! 🚀");
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: { code: string; type: string; value: number; maxUsage: number }) =>
      adminService.createCoupon(data),
    onSuccess: () => {
      toast.success("تم إنشاء كوبون الخصم بنجاح! 🏷️");
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isLoading,
    users: usersQuery.data,
    isLoadingUsers: usersQuery.isLoading,
    approvePayment: approvePaymentMutation.mutateAsync,
    approveTeacher: approveTeacherMutation.mutateAsync,
    broadcastNotification: broadcastMutation.mutateAsync,
    createCoupon: createCouponMutation.mutateAsync,
  };
}

export default useAdmin;
