import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import adminService from "@/services/admin.service";
import adminCategoryService from "@/services/adminCategory.service";
import { toast } from "react-hot-toast";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const ADMIN_KEYS = queryKeys.admin;

// ── Standalone Hooks for Admin Domain ────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminService.getDashboardData(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminUsers(filters?: { role?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: () => adminService.getUsers(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useAdminCourses(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.courses(filters),
    queryFn: () => adminService.getCourses(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useAdminPayments(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.payments(filters),
    queryFn: () => adminService.getPayments(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useAdminSubjects() {
  return useQuery({
    queryKey: queryKeys.admin.subjects(),
    queryFn: () => adminCategoryService.getSubjects(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminGrades() {
  return useQuery({
    queryKey: queryKeys.admin.grades(),
    queryFn: () => adminCategoryService.getGrades(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.admin.categories(),
    queryFn: () => adminCategoryService.getCategories(),
    staleTime: 1000 * 60 * 5,
  });
}

// ── Main Composite Hook ──────────────────────────────────────────────────────

export function useAdmin() {
  const queryClient = useQueryClient();

  const dashboardQuery = useAdminDashboard();

  const useUsers = (role?: string, search?: string) =>
    useQuery({
      queryKey: queryKeys.admin.users({ role, search }),
      queryFn: () => adminService.getUsers({ role, search }),
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    });

  const useCourses = (status?: string, search?: string) =>
    useQuery({
      queryKey: queryKeys.admin.courses({ status, search }),
      queryFn: () => adminService.getCourses({ status, search }),
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    });

  const usePayments = (status?: string) =>
    useQuery({
      queryKey: queryKeys.admin.payments({ status }),
      queryFn: () => adminService.getPayments({ status }),
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) =>
      adminService.updateUserStatus(userId, isBlocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("تم تحديث حالة المستخدم بنجاح 🔄");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تحديث حالة المستخدم");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("تم حذف المستخدم بنجاح 🗑️");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر حذف المستخدم");
    },
  });

  const updateCourseStatusMutation = useMutation({
    mutationFn: ({ courseId, status }: { courseId: string; status: "Published" | "Draft" | "Archived" }) =>
      adminService.updateCourseStatus(courseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("تم تحديث حالة الكورس بنجاح 🎉");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تحديث حالة الكورس");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => adminService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("تم حذف الكورس بنجاح 🗑️");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر حذف الكورس");
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isPending,
    isFetchingDashboard: dashboardQuery.isFetching,
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
