import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import teacherService from "@/services/teacher.service";
import { toast } from "react-hot-toast";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_KEYS = queryKeys.teacher;

export function useTeacher() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: queryKeys.teacher.dashboard(),
    queryFn: () => teacherService.getDashboardData(),
    staleTime: 1000 * 60 * 5,
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData: any) => teacherService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      toast.success("تم إنشاء الكورس ونشره على منصة EduSphere بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر إنشاء الكورس");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; payoutMethod: string; accountDetails: string }) =>
      teacherService.requestWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.all });
      toast.success("تم إرسال طلب السحب بنجاح إلى الإدارة المالية للمراجعة وسيتم تحويله خلال 24 ساعة.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر طلب السحب");
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isPending,
    isFetchingDashboard: dashboardQuery.isFetching,
    createCourse: createCourseMutation.mutateAsync,
    isCreatingCourse: createCourseMutation.isPending,
    requestWithdrawal: withdrawMutation.mutateAsync,
    isWithdrawing: withdrawMutation.isPending,
  };
}

export default useTeacher;
