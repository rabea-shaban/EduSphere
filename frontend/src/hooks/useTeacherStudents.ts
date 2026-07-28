import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherStudentService from "@/services/teacherStudent.service";
import type { TeacherStudentFilters } from "@/features/teacher/types/student";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const TEACHER_STUDENT_KEYS = {
  all: ["teacher-students"] as const,
  search: (filters?: TeacherStudentFilters) => ["teacher-students", "search", filters] as const,
  byId: (id: string) => ["teacher-students", "id", id] as const,
  progress: (id: string) => ["teacher-students", id, "progress"] as const,
  enrollments: (id: string) => ["teacher-students", id, "enrollments"] as const,
  quizzes: (id: string) => ["teacher-students", id, "quizzes"] as const,
  assignments: (id: string) => ["teacher-students", id, "assignments"] as const,
  certificates: (id: string) => ["teacher-students", id, "certificates"] as const,
  activity: (id: string) => ["teacher-students", id, "activity"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch students list enrolled in teacher's courses.
 */
export function useTeacherStudents(filters?: TeacherStudentFilters) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.search(filters),
    queryFn: () => teacherStudentService.getStudents(filters),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch detailed student profile for teacher.
 */
export function useTeacherStudent(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.byId(id),
    queryFn: () => teacherStudentService.getStudentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetch student progress.
 */
export function useStudentProgress(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.progress(id),
    queryFn: () => teacherStudentService.getStudentProgress(id),
    enabled: !!id,
  });
}

/**
 * Fetch student enrollments for teacher's courses.
 */
export function useStudentEnrollments(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.enrollments(id),
    queryFn: () => teacherStudentService.getStudentEnrollments(id),
    enabled: !!id,
  });
}

/**
 * Fetch student quizzes inside teacher's courses.
 */
export function useStudentQuizzes(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.quizzes(id),
    queryFn: () => teacherStudentService.getStudentQuizzes(id),
    enabled: !!id,
  });
}

/**
 * Fetch student assignment submissions inside teacher's courses.
 */
export function useStudentAssignments(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.assignments(id),
    queryFn: () => teacherStudentService.getStudentAssignments(id),
    enabled: !!id,
  });
}

/**
 * Fetch student certificates earned in teacher's courses.
 */
export function useStudentCertificates(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.certificates(id),
    queryFn: () => teacherStudentService.getStudentCertificates(id),
    enabled: !!id,
  });
}

/**
 * Issue a certificate to student.
 */
export function useIssueCertificate(studentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseId }: { id: string; courseId: string }) =>
      teacherStudentService.issueCertificate(id, courseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TEACHER_STUDENT_KEYS.certificates(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: TEACHER_STUDENT_KEYS.all });
      toast.success("تم إصدار الشهادة للطالب بنجاح 🎓");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إصدار الشهادة");
    },
  });
}

/**
 * Fetch student activity timeline.
 */
export function useStudentActivity(id: string) {
  return useQuery({
    queryKey: TEACHER_STUDENT_KEYS.activity(id),
    queryFn: () => teacherStudentService.getStudentActivity(id),
    enabled: !!id,
  });
}

/**
 * Send notification to student.
 */
export function useSendStudentNotification() {
  return useMutation({
    mutationFn: ({
      id,
      title,
      message,
    }: {
      id: string;
      title: string;
      message: string;
    }) => teacherStudentService.sendNotification(id, { title, message }),
    onSuccess: () => {
      toast.success("تم إرسال الإشعار للطالب بنجاح 📩");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إرسال الإشعار");
    },
  });
}
