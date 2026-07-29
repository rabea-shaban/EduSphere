import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherStudentService from "@/services/teacherStudent.service";
import type { TeacherStudentFilters } from "@/features/teacher/types/student";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const TEACHER_STUDENT_KEYS = queryKeys.teacher.students;

export function useTeacherStudents(filters?: TeacherStudentFilters) {
  return useQuery({
    queryKey: queryKeys.teacher.students.list(filters as Record<string, any>),
    queryFn: () => teacherStudentService.getStudents(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTeacherStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.teacher.students.byId(id),
    queryFn: () => teacherStudentService.getStudentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentProgress(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "progress", id],
    queryFn: () => teacherStudentService.getStudentProgress(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentEnrollments(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "enrollments", id],
    queryFn: () => teacherStudentService.getStudentEnrollments(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentQuizzes(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "quizzes", id],
    queryFn: () => teacherStudentService.getStudentQuizzes(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentAssignments(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "assignments", id],
    queryFn: () => teacherStudentService.getStudentAssignments(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentCertificates(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "certificates", id],
    queryFn: () => teacherStudentService.getStudentCertificates(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useIssueCertificate(_targetStudentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id?: string; studentId?: string; courseId: string }) => {
      const studentId = data.id || data.studentId || _targetStudentId || "";
      return teacherStudentService.issueCertificate(studentId, data.courseId);
    },
    onSuccess: (_, variables) => {
      const sId = variables.id || variables.studentId || _targetStudentId;
      if (sId) {
        queryClient.invalidateQueries({ queryKey: ["teacher-students", "certificates", sId] });
      }
      toast.success("تم إصدار الشهادة بنجاح للطالب.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إصدار الشهادة");
    },
  });
}

export function useStudentActivity(id: string) {
  return useQuery({
    queryKey: ["teacher-students", "activity", id],
    queryFn: () => teacherStudentService.getStudentActivity(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSendStudentNotification() {
  return useMutation({
    mutationFn: (params: { id?: string; studentId?: string; title?: string; message: string; subject?: string }) => {
      const studentId = params.id || params.studentId || "";
      const body = {
        title: params.title || params.subject || "تنبيه جديد",
        message: params.message,
      };
      return teacherStudentService.sendNotification(studentId, body);
    },
    onSuccess: () => {
      toast.success("تم إرسال الإشعار إلى الطالب بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إرسال الإشعار للطالب");
    },
  });
}
