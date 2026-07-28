import { Types } from 'mongoose';
import { Review, IReviewDocument, ReviewStatus } from '../review.model';
import { ApiError } from '../../../utils/ApiError';
import { RatingService } from './rating.service';

export class ModerationService {
  /**
   * Flags a review as inappropriate or spam.
   */
  static async flagReview(reviewId: string, userId: string, reason?: string): Promise<IReviewDocument> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    review.isFlagged = true;
    review.flaggedReason = reason || 'محتوى غير لائق أو مخالف للشروط';
    review.flaggedBy = new Types.ObjectId(userId);
    review.status = 'FLAGGED';

    await review.save();
    return review;
  }

  /**
   * Updates moderation status (APPROVED, REJECTED, PENDING_MODERATION).
   */
  static async updateStatus(reviewId: string, status: ReviewStatus): Promise<IReviewDocument> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    review.status = status;
    if (status === 'APPROVED') {
      review.isFlagged = false;
    }

    await review.save();

    // Recalculate rating on course
    await RatingService.recalculateCourseRating(review.courseId);

    return review;
  }

  /**
   * Retrieves pending or flagged reviews for admin moderation queue.
   */
  static async getModerationQueue(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const filter: any = { status: { $in: ['FLAGGED', 'PENDING_MODERATION'] } };

    const reviews = await Review.find(filter)
      .populate('studentId', 'firstName lastName email avatar')
      .populate('courseId', 'title thumbnail')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default ModerationService;
