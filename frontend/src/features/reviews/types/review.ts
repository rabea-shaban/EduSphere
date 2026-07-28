export type ReviewSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type ReviewStatus = "APPROVED" | "PENDING_MODERATION" | "REJECTED" | "FLAGGED";

export interface TeacherReplyData {
  replyText: string;
  repliedAt: string;
  updatedAt?: string;
}

export interface HelpfulVotesData {
  count: number;
  userIds: string[];
}

export interface CourseReviewItem {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    thumbnail?: string;
    category?: string;
  } | string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    username?: string;
    email?: string;
  } | string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  sentiment: ReviewSentiment;
  keywords: string[];
  teacherReply?: TeacherReplyData;
  helpfulVotes: HelpfulVotesData;
  status: ReviewStatus;
  isFlagged: boolean;
  flaggedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StarDistributionItem {
  count: number;
  percentage: number;
}

export interface RatingBreakdownSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: StarDistributionItem;
    4: StarDistributionItem;
    3: StarDistributionItem;
    2: StarDistributionItem;
    1: StarDistributionItem;
  };
}

export interface CourseReviewsResponse {
  reviews: CourseReviewItem[];
  ratingSummary: RatingBreakdownSummary;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeacherReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  responseRate: number;
  repliedCount: number;
  unrepliedCount: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topKeywords: { keyword: string; count: number }[];
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilters {
  starFilter?: number;
  courseId?: string;
  hasReply?: boolean;
  page?: number;
  limit?: number;
}
