import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import reviewService from "@/services/review.service";
import type { ReviewFilters, ReviewStatus } from "@/features/reviews/types/review";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  course: (courseId: string, filters?: ReviewFilters) => ["reviews", "course", courseId, filters] as const,
  teacherList: (filters?: ReviewFilters) => ["reviews", "teacher-list", filters] as const,
  teacherAnalytics: ["reviews", "teacher-analytics"] as const,
  adminModeration: (filters?: ReviewFilters) => ["reviews", "admin-moderation", filters] as const,
};

export function useCourseReviews(courseId: string, filters?: ReviewFilters) {
  return useQuery({
    queryKey: REVIEW_KEYS.course(courseId, filters),
    queryFn: () => reviewService.getCourseReviews(courseId, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 3,
  });
}

export function useSubmitReview(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment: string; title?: string }) =>
      reviewService.submitReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("تم إرسال تقييمك ومراجعتك بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر إرسال التقييم");
    },
  });
}

export function useVoteHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.voteHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تسجيل إعجابك بالمراجعة");
    },
  });
}

export function useFlagReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason?: string }) =>
      reviewService.flagReview(reviewId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("تم الإبلاغ عن المراجعة بنجاح وفي انتظار مراجعة الإدارة");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر الإبلاغ عن المراجعة");
    },
  });
}

export function useTeacherReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: REVIEW_KEYS.teacherList(filters),
    queryFn: () => reviewService.getTeacherReviews(filters),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherReviewAnalytics() {
  return useQuery({
    queryKey: REVIEW_KEYS.teacherAnalytics,
    queryFn: () => reviewService.getTeacherReviewAnalytics(),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTeacherReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyText }: { reviewId: string; replyText: string }) =>
      reviewService.postTeacherReply(reviewId, replyText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("تم حفظ رد المحاضر بنجاح 💬");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حفظ رد المحاضر");
    },
  });
}

export function useDeleteTeacherReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteTeacherReply(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("تم حذف رد المحاضر بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف رد المحاضر");
    },
  });
}

export function useAdminModerationReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: REVIEW_KEYS.adminModeration(filters),
    queryFn: () => reviewService.getAdminModeration(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, status }: { reviewId: string; status: ReviewStatus }) =>
      reviewService.updateReviewStatus(reviewId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      toast.success("تم تحديث حالة المراجعة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحديث حالة المراجعة");
    },
  });
}
