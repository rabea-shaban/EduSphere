import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import reviewService from "@/services/review.service";
import type { ReviewFilters, ReviewStatus } from "@/features/reviews/types/review";
import { queryKeys, handleApiError } from "@/lib/react-query";

export const REVIEW_KEYS = queryKeys.reviews;

export function useCourseReviews(courseId: string, filters?: ReviewFilters) {
  return useQuery({
    queryKey: queryKeys.reviews.byCourse(courseId),
    queryFn: () => reviewService.getCourseReviews(courseId, filters),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useSubmitReview(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment: string; title?: string }) =>
      reviewService.submitReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("تم إرسال تقييمك ومراجعتك بنجاح.");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر إرسال التقييم");
    },
  });
}

export function useVoteHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.voteHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تسجيل إعجابك بالمراجعة");
    },
  });
}

export function useFlagReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason?: string }) =>
      reviewService.flagReview(reviewId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("تم الإبلاغ عن المراجعة بنجاح وفي انتظار مراجعة الإدارة");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر الإبلاغ عن المراجعة");
    },
  });
}

export function useTeacherReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: ["reviews", "teacher-list", filters],
    queryFn: () => reviewService.getTeacherReviews(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTeacherReviewAnalytics() {
  return useQuery({
    queryKey: ["reviews", "teacher-analytics"],
    queryFn: () => reviewService.getTeacherReviewAnalytics(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTeacherReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyText }: { reviewId: string; replyText: string }) =>
      reviewService.postTeacherReply(reviewId, replyText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("تم حفظ رد المحاضر بنجاح 💬");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حفظ رد المحاضر");
    },
  });
}

export function useDeleteTeacherReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteTeacherReply(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("تم حذف رد المحاضر بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر حذف رد المحاضر");
    },
  });
}

export function useAdminModerationReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: ["reviews", "admin-moderation", filters],
    queryFn: () => reviewService.getAdminModeration(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, status }: { reviewId: string; status: ReviewStatus }) =>
      reviewService.updateReviewStatus(reviewId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("تم تحديث حالة المراجعة بنجاح");
    },
    onError: (error: any) => {
      handleApiError(error, "تعذر تحديث حالة المراجعة");
    },
  });
}
