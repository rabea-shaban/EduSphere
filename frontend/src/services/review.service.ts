import api from "./api";
import type {
  CourseReviewsResponse,
  CourseReviewItem,
  TeacherReviewAnalytics,
  ReviewFilters,
  ReviewStatus,
} from "@/features/reviews/types/review";
import type { ApiResponse } from "@/features/dashboard/types/api";

interface TeacherReviewsResponse {
  reviews: CourseReviewItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const reviewService = {
  /**
   * Get public reviews for a course with rating distribution breakdown.
   */
  async getCourseReviews(courseId: string, filters?: ReviewFilters): Promise<CourseReviewsResponse> {
    const response = await api.get<ApiResponse<CourseReviewsResponse>>(
      `/courses/${courseId}/reviews`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Submit or update a student review for a course.
   */
  async submitReview(
    courseId: string,
    data: { rating: number; comment: string; title?: string }
  ): Promise<CourseReviewItem> {
    const response = await api.post<ApiResponse<CourseReviewItem>>(
      `/courses/${courseId}/reviews`,
      data
    );
    return response.data.data;
  },

  /**
   * Vote "Helpful" on a review.
   */
  async voteHelpful(reviewId: string): Promise<CourseReviewItem> {
    const response = await api.post<ApiResponse<CourseReviewItem>>(
      `/reviews/${reviewId}/helpful`
    );
    return response.data.data;
  },

  /**
   * Flag an inappropriate review.
   */
  async flagReview(reviewId: string, reason?: string): Promise<CourseReviewItem> {
    const response = await api.post<ApiResponse<CourseReviewItem>>(
      `/reviews/${reviewId}/flag`,
      { reason }
    );
    return response.data.data;
  },

  /**
   * Get teacher reviews for their courses.
   */
  async getTeacherReviews(filters?: ReviewFilters): Promise<TeacherReviewsResponse> {
    const response = await api.get<ApiResponse<TeacherReviewsResponse>>(
      `/teacher/reviews`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get review analytics for teacher dashboard.
   */
  async getTeacherReviewAnalytics(): Promise<TeacherReviewAnalytics> {
    const response = await api.get<ApiResponse<TeacherReviewAnalytics>>(
      `/teacher/reviews/analytics`
    );
    return response.data.data;
  },

  /**
   * Post or edit teacher official reply on a review.
   */
  async postTeacherReply(reviewId: string, replyText: string): Promise<CourseReviewItem> {
    const response = await api.post<ApiResponse<CourseReviewItem>>(
      `/teacher/reviews/${reviewId}/reply`,
      { replyText }
    );
    return response.data.data;
  },

  /**
   * Delete teacher reply.
   */
  async deleteTeacherReply(reviewId: string): Promise<CourseReviewItem> {
    const response = await api.delete<ApiResponse<CourseReviewItem>>(
      `/teacher/reviews/${reviewId}/reply`
    );
    return response.data.data;
  },

  /**
   * Get admin moderation queue for flagged reviews.
   */
  async getAdminModeration(filters?: ReviewFilters): Promise<TeacherReviewsResponse> {
    const response = await api.get<ApiResponse<TeacherReviewsResponse>>(
      `/admin/reviews/moderation`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Update review status (APPROVED, REJECTED, PENDING_MODERATION).
   */
  async updateReviewStatus(reviewId: string, status: ReviewStatus): Promise<CourseReviewItem> {
    const response = await api.patch<ApiResponse<CourseReviewItem>>(
      `/admin/reviews/${reviewId}/status`,
      { status }
    );
    return response.data.data;
  },
};

export default reviewService;
