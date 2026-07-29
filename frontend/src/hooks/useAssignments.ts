import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import assignmentService from "@/services/assignment.service";
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
  AssignmentFilters,
} from "@/features/teacher/types/assignment";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const ASSIGNMENT_KEYS = queryKeys.assignments;

/**
 * Fetch assignments list.
 */
export function useAssignments(filters?: AssignmentFilters) {
  return useQuery({
    queryKey: queryKeys.assignments.byCourse(JSON.stringify(filters ?? {})),
    queryFn: () => assignmentService.getAssignments(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch single assignment by ID.
 */
export function useAssignment(id: string) {
  return useQuery({
    queryKey: queryKeys.assignments.byId(id),
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم إنشاء الواجب التطبيقي بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إنشاء الواجب التطبيقي");
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
      queryClient.setQueryData(queryKeys.assignments.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم تحديث إعدادات الواجب التطبيقي بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث الواجب التطبيقي");
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
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم حذف الواجب بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حذف الواجب");
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
      queryClient.setQueryData(queryKeys.assignments.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم نشر الواجب التطبيقي للطلاب بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر نشر الواجب");
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
      queryClient.setQueryData(queryKeys.assignments.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم تحويل الواجب إلى مسودة");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إلغاء النشر");
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
      queryClient.setQueryData(queryKeys.assignments.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم أرشفة الواجب بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر أرشفة الواجب");
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
      queryClient.setQueryData(queryKeys.assignments.byId(updatedAssignment._id), updatedAssignment);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم استعادة الواجب بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر استعادة الواجب");
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
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم تكرار الواجب بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تكرار الواجب");
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
    queryKey: queryKeys.assignments.submissions(assignmentId),
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId, params),
    enabled: !!assignmentId,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch single submission details.
 */
export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ["assignments", "submission", submissionId],
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
        ["assignments", "submission", updatedSubmission._id],
        updatedSubmission
      );
      if (assignmentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.assignments.submissions(assignmentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all });
      toast.success("تم رصد الدرجة والتغذية الراجعة بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر رصد الدرجة");
    },
  });
}

/**
 * Fetch assignment analytics.
 */
export function useAssignmentAnalytics(assignmentId: string) {
  return useQuery({
    queryKey: ["assignments", "analytics", assignmentId],
    queryFn: () => assignmentService.getAssignmentAnalytics(assignmentId),
    enabled: !!assignmentId,
  });
}
