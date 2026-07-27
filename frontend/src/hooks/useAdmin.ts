import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "@/services/admin.service";
import { toast } from "react-hot-toast";

export const ADMIN_KEYS = {
  dashboard: ["admin", "dashboard"],
  users: (role?: string, search?: string) => ["admin", "users", role ?? "all", search ?? ""],
  courses: (status?: string, search?: string) => ["admin", "courses", status ?? "all", search ?? ""],
  payments: (status?: string) => ["admin", "payments", status ?? "all"],
};

export function useAdmin() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ADMIN_KEYS.dashboard,
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 60 * 3,
  });

  const useUsers = (role?: string, search?: string) =>
    useQuery({
      queryKey: ADMIN_KEYS.users(role, search),
      queryFn: () => adminService.getUsers({ role, search }),
      staleTime: 1000 * 60 * 2,
    });

  const useCourses = (status?: string, search?: string) =>
    useQuery({
      queryKey: ADMIN_KEYS.courses(status, search),
      queryFn: () => adminService.getCourses({ status, search }),
      staleTime: 1000 * 60 * 2,
    });

  const usePayments = (status?: string) =>
    useQuery({
      queryKey: ADMIN_KEYS.payments(status),
      queryFn: () => adminService.getPayments({ status }),
      staleTime: 1000 * 60 * 2,
    });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) =>
      adminService.updateUserStatus(userId, isBlocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم تحديث حالة المستخدم بنجاح 🔄");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر تحديث حالة المستخدم");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم حذف المستخدم بنجاح 🗑️");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر حذف المستخدم");
    },
  });

  const updateCourseStatusMutation = useMutation({
    mutationFn: ({ courseId, status }: { courseId: string; status: "Published" | "Draft" | "Archived" }) =>
      adminService.updateCourseStatus(courseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم تحديث حالة الكورس بنجاح 🎉");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر تحديث حالة الكورس");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => adminService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.dashboard });
      toast.success("تم حذف الكورس بنجاح 🗑️");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر حذف الكورس");
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isLoading,
    useUsers,
    useCourses,
    usePayments,
    updateUserStatus: updateUserStatusMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    updateCourseStatus: updateCourseStatusMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,
  };
}

export default useAdmin;
