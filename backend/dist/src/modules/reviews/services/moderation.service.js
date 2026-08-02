"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationService = void 0;
const mongoose_1 = require("mongoose");
const review_model_1 = require("../review.model");
const ApiError_1 = require("../../../utils/ApiError");
const rating_service_1 = require("./rating.service");
class ModerationService {
    /**
     * Flags a review as inappropriate or spam.
     */
    static async flagReview(reviewId, userId, reason) {
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new ApiError_1.ApiError(404, 'Review not found');
        }
        review.isFlagged = true;
        review.flaggedReason = reason || 'محتوى غير لائق أو مخالف للشروط';
        review.flaggedBy = new mongoose_1.Types.ObjectId(userId);
        review.status = 'FLAGGED';
        await review.save();
        return review;
    }
    /**
     * Updates moderation status (APPROVED, REJECTED, PENDING_MODERATION).
     */
    static async updateStatus(reviewId, status) {
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new ApiError_1.ApiError(404, 'Review not found');
        }
        review.status = status;
        if (status === 'APPROVED') {
            review.isFlagged = false;
        }
        await review.save();
        // Recalculate rating on course
        await rating_service_1.RatingService.recalculateCourseRating(review.courseId);
        return review;
    }
    /**
     * Retrieves pending or flagged reviews for admin moderation queue.
     */
    static async getModerationQueue(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const filter = { status: { $in: ['FLAGGED', 'PENDING_MODERATION'] } };
        const reviews = await review_model_1.Review.find(filter)
            .populate('studentId', 'firstName lastName email avatar')
            .populate('courseId', 'title thumbnail')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await review_model_1.Review.countDocuments(filter);
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
exports.ModerationService = ModerationService;
exports.default = ModerationService;
