import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import assignmentService from "@/services/assignment.service";
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
  AssignmentFilters,
} from "@/features/teacher/types/assignment";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const ASSIGNMENT_KEYS = {
  all: ["assignments"] as const,
  search: (filters?: AssignmentFilters) => ["assignments", "search", filters] as const,
  byId: (id: string) => ["assignments", "id", id] as const,
  submissions: (assignmentId: string, params?: object) => ["assignments", assignmentId, "submissions", params] as const,
  submissionById: (submissionId: string) => ["submissions", "id", submissionId] as const,
  analytics: (assignmentId: string) => ["assignments", assignmentId, "analytics"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch assignments list.
 */
export function useAssignments(filters?: AssignmentFilters) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.search(filters),
    queryFn: () => assignmentService.getAssignments(filters),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch single assignment by ID.
 */
export function useAssignment(id: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.byId(id),
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Create a new assignment.
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => assignmentService.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم إنشاء الواجب التطبيقي بنجاح 📝");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إنشاء الواجب التطبيقي");
    },
  });
}

/**
 * Update an assignment.
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentInput }) =>
      assignmentService.updateAssignment(id, data),
    onSuccess: (updatedAssignment) => {
      queryClient.setQueryData(ASSIGNMENT_KEYS.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم تحديث إعدادات الواجب التطبيقي بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث الواجب التطبيقي");
    },
  });
}

/**
 * Soft-delete an assignment.
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم حذف الواجب بنجاح 🗑️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف الواجب");
    },
  });
}

/**
 * Publish an assignment.
 */
export function usePublishAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.publishAssignment(id),
    onSuccess: (updatedAssignment) => {
      queryClient.setQueryData(ASSIGNMENT_KEYS.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم نشر الواجب التطبيقي للطلاب بنجاح 🚀");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر نشر الواجب");
    },
  });
}

/**
 * Unpublish an assignment.
 */
export function useUnpublishAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.unpublishAssignment(id),
    onSuccess: (updatedAssignment) => {
      queryClient.setQueryData(ASSIGNMENT_KEYS.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم تحويل الواجب إلى مسودة ✏️");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إلغاء النشر");
    },
  });
}

/**
 * Archive an assignment.
 */
export function useArchiveAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.archiveAssignment(id),
    onSuccess: (updatedAssignment) => {
      queryClient.setQueryData(ASSIGNMENT_KEYS.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم أرشفة الواجب بنجاح 📦");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر أرشفة الواجب");
    },
  });
}

/**
 * Restore an archived assignment.
 */
export function useRestoreAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.restoreAssignment(id),
    onSuccess: (updatedAssignment) => {
      queryClient.setQueryData(ASSIGNMENT_KEYS.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم استعادة الواجب بنجاح ✅");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر استعادة الواجب");
    },
  });
}

/**
 * Duplicate an assignment.
 */
export function useDuplicateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.duplicateAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم تكرار الواجب بنجاح 📋");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تكرار الواجب");
    },
  });
}

/**
 * Fetch assignment submissions.
 */
export function useAssignmentSubmissions(
  assignmentId: string,
  params?: { page?: number; limit?: number; status?: string }
) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.submissions(assignmentId, params),
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId, params),
    enabled: !!assignmentId,
  });
}

/**
 * Fetch single submission details.
 */
export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.submissionById(submissionId),
    queryFn: () => assignmentService.getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
}

/**
 * Grade a submission.
 */
export function useGradeSubmission(assignmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: GradeSubmissionInput;
    }) => assignmentService.gradeSubmission(submissionId, data),
    onSuccess: (updatedSubmission) => {
      queryClient.setQueryData(
        ASSIGNMENT_KEYS.submissionById(updatedSubmission._id),
        updatedSubmission
      );
      if (assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ASSIGNMENT_KEYS.submissions(assignmentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("تم رصد الدرجة والتغذية الراجعة بنجاح 🎉");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر رصد الدرجة");
    },
  });
}

/**
 * Fetch assignment analytics.
 */
export function useAssignmentAnalytics(assignmentId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.analytics(assignmentId),
    queryFn: () => assignmentService.getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
  });
}
