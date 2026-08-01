import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import studentService from "@/services/student.service";
import { toast } from "react-hot-toast";
import { UpdateProfileInput, ChangePasswordInput, UpdateAvatarInput, UpdateProgressInput, GetNotificationsParams } from "@/features/dashboard/types/api";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const STUDENT_KEYS = queryKeys.student;

export function useStudent() {
  const queryClient = useQueryClient();

  // ── Profile Queries & Mutations ──────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: queryKeys.student.profile(),
    queryFn: () => studentService.getProfile(),
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => studentService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.student.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      toast.success("تم تحديث البيانات الشخصية بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء تحديث البيانات الشخصية");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => studentService.changePassword(data),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء تغيير كلمة المرور");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (data: UpdateAvatarInput) => studentService.updateAvatar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.profile() });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("تم تحديث الصورة الشخصية بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "حدث خطأ أثناء تحديث الصورة الشخصية");
    },
  });

  // ── Enrolled Courses Query ───────────────────────────────────────────────
  const useMyCourses = (status?: string) =>
    useQuery({
      queryKey: queryKeys.student.myCourses(status),
      queryFn: () => studentService.getMyCourses({ status }),
      staleTime: 1000 * 60 * 3,
      placeholderData: keepPreviousData,
    });

  const enrollCourseMutation = useMutation({
    mutationFn: (courseId: string) => studentService.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      toast.success("تم الاشتراك في الكورس بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر الاشتراك في الكورس");
    },
  });

  // ── Progress & Lesson Queries & Mutations ────────────────────────────────
  const useCourseProgress = (courseId: string) =>
    useQuery({
      queryKey: queryKeys.student.courseProgress(courseId),
      queryFn: () => studentService.getCourseProgress(courseId),
      enabled: !!courseId,
    });

  const updateProgressMutation = useMutation({
    mutationFn: (data: UpdateProgressInput) => studentService.updateProgress(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.courseProgress(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
    },
  });

  // ── Quizzes & Exam Attempts ───────────────────────────────────────────────
  const useQuizzes = (courseId?: string) =>
    useQuery({
      queryKey: queryKeys.student.quizzes(courseId),
      queryFn: () => studentService.getQuizzes({ courseId }),
      staleTime: 1000 * 60 * 3,
      placeholderData: keepPreviousData,
    });

  const startExamAttemptMutation = useMutation({
    mutationFn: (quizId: string) => studentService.startExamAttempt(quizId),
    onError: (err: any) => {
      handleApiError(err, "تعذر بدء الاختبار");
    },
  });

  const submitExamAttemptMutation = useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: Array<{ questionId: string; studentAnswer: any }> }) =>
      studentService.submitExamAttempt(attemptId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      toast.success("تم تسليم الاختبار بنجاح.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تسليم إجابات الاختبار");
    },
  });

  const useMyExamAttempts = (quizId?: string) =>
    useQuery({
      queryKey: queryKeys.student.examAttempts(quizId),
      queryFn: () => studentService.getMyExamAttempts(quizId),
    });

  // ── Assignments & Submissions ─────────────────────────────────────────────
  const useAssignments = (courseId?: string) =>
    useQuery({
      queryKey: queryKeys.student.assignments(courseId),
      queryFn: () => studentService.getAssignments({ courseId }),
      staleTime: 1000 * 60 * 3,
      placeholderData: keepPreviousData,
    });

  const submitAssignmentMutation = useMutation({
    mutationFn: (data: { assignmentId: string; attachments?: string[]; textAnswer?: string }) =>
      studentService.submitAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      toast.success("تم تسليم الواجب بنجاح وإرساله للمعلم.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر تسليم الواجب");
    },
  });

  const useMySubmissions = (assignmentId?: string) =>
    useQuery({
      queryKey: queryKeys.student.submissions(assignmentId),
      queryFn: () => studentService.getMySubmissions(assignmentId),
    });

  // ── Notifications ─────────────────────────────────────────────────────────
  const useNotifications = (params?: GetNotificationsParams) =>
    useQuery({
      queryKey: queryKeys.student.notifications(params as Record<string, any>),
      queryFn: () => studentService.getNotifications(params),
      staleTime: 1000 * 30, // 30 seconds
      refetchInterval: 1000 * 60, // Poll every 60s
    });

  const notificationsQuery = useNotifications();

  const markNotificationReadMutation = useMutation({
    mutationFn: (id: string) => studentService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: () => studentService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم تحديد جميع الإشعارات كـ مقروءة.");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => studentService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("تم حذف الإشعار.");
    },
    onError: (err: any) => {
      handleApiError(err, "تعذر حذف الإشعار");
    },
  });

  return {
    // Profile
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isPending,
    isFetchingProfile: profileQuery.isFetching,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUpdatingAvatar: updateAvatarMutation.isPending,

    // Courses & Enrollments
    useMyCourses,
    enrollCourse: enrollCourseMutation.mutateAsync,
    isEnrolling: enrollCourseMutation.isPending,

    // Progress & Lessons
    useCourseProgress,
    updateProgress: updateProgressMutation.mutateAsync,

    // Quizzes
    useQuizzes,
    startExamAttempt: startExamAttemptMutation.mutateAsync,
    isStartingAttempt: startExamAttemptMutation.isPending,
    submitExamAttempt: submitExamAttemptMutation.mutateAsync,
    isSubmittingAttempt: submitExamAttemptMutation.isPending,
    useMyExamAttempts,

    // Assignments
    useAssignments,
    submitAssignment: submitAssignmentMutation.mutateAsync,
    isSubmittingAssignment: submitAssignmentMutation.isPending,
    useMySubmissions,

    // Notifications
    useNotifications,
    notifications: notificationsQuery.data?.notifications,
    unreadNotificationsCount: notificationsQuery.data?.unreadCount,
    isLoadingNotifications: notificationsQuery.isPending,
    markNotificationRead: markNotificationReadMutation.mutateAsync,
    markAllNotificationsRead: markAllNotificationsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
}

export default useStudent;
