import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "@/services/student.service";
import { toast } from "react-hot-toast";

export const STUDENT_KEYS = {
  dashboard: ["student", "dashboard"],
  courses: ["student", "courses"],
  lesson: (id: string) => ["student", "lesson", id],
};

export function useStudent() {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: STUDENT_KEYS.dashboard,
    queryFn: () => studentService.getDashboardData(),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  const coursesQuery = useQuery({
    queryKey: STUDENT_KEYS.courses,
    queryFn: () => studentService.getCourses(),
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      studentService.submitAssignment(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard });
      toast.success("تم تسليم الملف بنجاح وإرساله للمعلم! 🎉");
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: any[] }) =>
      studentService.submitQuizAnswers(quizId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard });
    },
  });

  return {
    dashboardData: dashboardQuery.data,
    isLoadingDashboard: dashboardQuery.isLoading,
    courses: coursesQuery.data,
    isLoadingCourses: coursesQuery.isLoading,
    submitAssignment: submitAssignmentMutation.mutateAsync,
    isSubmittingAssignment: submitAssignmentMutation.isPending,
    submitQuiz: submitQuizMutation.mutateAsync,
    isSubmittingQuiz: submitQuizMutation.isPending,
  };
}

export default useStudent;
