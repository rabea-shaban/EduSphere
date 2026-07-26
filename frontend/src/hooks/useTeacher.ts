import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import teacherService from "@/services/teacher.service";
import { toast } from "react-hot-toast";

export const TEACHER_KEYS = {
  dashboard: ["teacher", "dashboard"],
};

export function useTeacher() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: TEACHER_KEYS.dashboard,
    queryFn: () => teacherService.getDashboardData(),
    staleTime: 1000 * 60 * 3,
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData: any) => teacherService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.dashboard });
      toast.success("تم إنشاء الكورس ونشره على منصة EduSphere بنجاح! 🎉");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; payoutMethod: string; accountDetails: string }) =>
      teacherService.requestWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.dashboard });
      toast.success("تم إرسال طلب السحب بنجاح إلى الإدارة المالية للمراجعة وسيتم تحويله خلال 24 ساعة. 💸");
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isLoading,
    createCourse: createCourseMutation.mutateAsync,
    isCreatingCourse: createCourseMutation.isPending,
    requestWithdrawal: withdrawMutation.mutateAsync,
    isWithdrawing: withdrawMutation.isPending,
  };
}

export default useTeacher;
