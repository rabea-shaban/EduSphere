import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "@/services/student.service";
import { toast } from "react-hot-toast";
import { UpdateProfileInput, ChangePasswordInput, UpdateAvatarInput, UpdateProgressInput, GetNotificationsParams } from "@/features/dashboard/types/api";

export const STUDENT_KEYS = {
  profile: ["student", "profile"],
  myCourses: (status?: string) => ["student", "myCourses", status ?? "all"],
  courseDetails: (id: string) => ["student", "course", id],
  lessonDetails: (id: string) => ["student", "lesson", id],
  courseLessons: (courseId: string) => ["student", "lessons", courseId],
  courseProgress: (courseId: string) => ["student", "progress", courseId],
  quizzes: (courseId?: string) => ["student", "quizzes", courseId ?? "all"],
  quizDetails: (id: string) => ["student", "quiz", id],
  examAttemptsHistory: (quizId?: string) => ["student", "examAttempts", quizId ?? "all"],
  assignments: (courseId?: string) => ["student", "assignments", courseId ?? "all"],
  assignmentDetails: (id: string) => ["student", "assignment", id],
  mySubmissions: (assignmentId?: string) => ["student", "submissions", assignmentId ?? "all"],
  notifications: (params?: GetNotificationsParams) => ["student", "notifications", JSON.stringify(params ?? {})],
};

export function useStudent() {
  const queryClient = useQueryClient();

  // ── Profile Queries & Mutations ──────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: STUDENT_KEYS.profile,
    queryFn: () => studentService.getProfile(),
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => studentService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.profile });
      toast.success("تم تحديث البيانات الشخصية بنجاح 🎉");
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تحديث البيانات الشخصية");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => studentService.changePassword(data),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح 🔒");
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تغيير كلمة المرور");
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (data: UpdateAvatarInput) => studentService.updateAvatar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.profile });
      toast.success("تم تحديث الصورة الشخصية بنجاح 📸");
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تحديث الصورة الشخصية");
    },
  });

  // ── Enrolled Courses Query ───────────────────────────────────────────────
  const useMyCourses = (status?: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.myCourses(status),
      queryFn: () => studentService.getMyCourses({ status }),
      staleTime: 1000 * 60 * 3,
    });

  const enrollCourseMutation = useMutation({
    mutationFn: (courseId: string) => studentService.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "myCourses"] });
      toast.success("تم الاشتراك في الكورس بنجاح 🎓");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر الاشتراك في الكورس");
    },
  });

  // ── Progress & Lesson Queries & Mutations ────────────────────────────────
  const useCourseProgress = (courseId: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.courseProgress(courseId),
      queryFn: () => studentService.getCourseProgress(courseId),
      enabled: !!courseId,
    });

  const updateProgressMutation = useMutation({
    mutationFn: (data: UpdateProgressInput) => studentService.updateProgress(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.courseProgress(variables.courseId) });
      queryClient.invalidateQueries({ queryKey: ["student", "myCourses"] });
    },
  });

  // ── Quizzes & Exam Attempts ───────────────────────────────────────────────
  const useQuizzes = (courseId?: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.quizzes(courseId),
      queryFn: () => studentService.getQuizzes({ courseId }),
      staleTime: 1000 * 60 * 3,
    });

  const startExamAttemptMutation = useMutation({
    mutationFn: (quizId: string) => studentService.startExamAttempt(quizId),
    onError: (err: any) => {
      toast.error(err?.message || "تعذر بدء الاختبار");
    },
  });

  const submitExamAttemptMutation = useMutation({
    mutationFn: ({ attemptId, answers }: { attemptId: string; answers: Array<{ questionId: string; studentAnswer: any }> }) =>
      studentService.submitExamAttempt(attemptId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "examAttempts"] });
      queryClient.invalidateQueries({ queryKey: ["student", "quizzes"] });
      toast.success("تم إرسال إجابات الاختبار بنجاح 📝");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر تسليم إجابات الاختبار");
    },
  });

  const useMyExamAttempts = (quizId?: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.examAttemptsHistory(quizId),
      queryFn: () => studentService.getMyExamAttempts(quizId),
    });

  // ── Assignments & Submissions ─────────────────────────────────────────────
  const useAssignments = (courseId?: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.assignments(courseId),
      queryFn: () => studentService.getAssignments({ courseId }),
      staleTime: 1000 * 60 * 3,
    });

  const submitAssignmentMutation = useMutation({
    mutationFn: (data: { assignmentId: string; attachments?: string[]; textAnswer?: string }) =>
      studentService.submitAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "submissions"] });
      toast.success("تم تسليم الواجب بنجاح وإرساله للمعلم 📤");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر تسليم الواجب");
    },
  });

  const useMySubmissions = (assignmentId?: string) =>
    useQuery({
      queryKey: STUDENT_KEYS.mySubmissions(assignmentId),
      queryFn: () => studentService.getMySubmissions(assignmentId),
    });

  // ── Notifications ─────────────────────────────────────────────────────────
  const useNotifications = (params?: GetNotificationsParams) =>
    useQuery({
      queryKey: STUDENT_KEYS.notifications(params),
      queryFn: () => studentService.getNotifications(params),
      staleTime: 1000 * 30, // 30 seconds
      refetchInterval: 1000 * 60, // Poll every 60s
    });

  const notificationsQuery = useNotifications();

  const markNotificationReadMutation = useMutation({
    mutationFn: (id: string) => studentService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
    },
  });

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: () => studentService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
      toast.success("تم تحديد جميع الإشعارات كـ مقروءة 🔔");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => studentService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
      toast.success("تم حذف الإشعار 🗑️");
    },
    onError: (err: any) => {
      toast.error(err?.message || "تعذر حذف الإشعار");
    },
  });

  return {
    // Profile
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
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
    isLoadingNotifications: notificationsQuery.isLoading,
    markNotificationRead: markNotificationReadMutation.mutateAsync,
    markAllNotificationsRead: markAllNotificationsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
}

export default useStudent;
