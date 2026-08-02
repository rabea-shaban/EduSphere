"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAnalyticsService = void 0;
const mongoose_1 = require("mongoose");
const review_model_1 = require("../review.model");
const course_model_1 = require("../../courses/course.model");
class ReviewAnalyticsService {
    /**
     * Generates comprehensive analytics for teacher's courses.
     */
    static async getTeacherReviewAnalytics(teacherId, userRole) {
        let teacherCourseIds = [];
        if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
            const allCourses = await course_model_1.Course.find({ isDeleted: { $ne: true } }).select('_id').lean();
            teacherCourseIds = allCourses.map((c) => c._id);
        }
        else {
            const teacherCourses = await course_model_1.Course.find({ teacher: new mongoose_1.Types.ObjectId(teacherId), isDeleted: { $ne: true } }).select('_id').lean();
            teacherCourseIds = teacherCourses.map((c) => c._id);
        }
        const matchFilter = { courseId: { $in: teacherCourseIds }, status: 'APPROVED' };
        const reviews = await review_model_1.Review.find(matchFilter).lean();
        const totalReviews = reviews.length;
        let sumRating = 0;
        let repliedCount = 0;
        const sentimentDist = { positive: 0, neutral: 0, negative: 0 };
        const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const keywordMap = {};
        reviews.forEach((r) => {
            sumRating += r.rating;
            if (r.teacherReply && r.teacherReply.replyText) {
                repliedCount++;
            }
            if (r.sentiment === 'POSITIVE')
                sentimentDist.positive++;
            else if (r.sentiment === 'NEGATIVE')
                sentimentDist.negative++;
            else
                sentimentDist.neutral++;
            if (r.rating >= 1 && r.rating <= 5) {
                ratingDist[r.rating] = (ratingDist[r.rating] || 0) + 1;
            }
            if (r.keywords && Array.isArray(r.keywords)) {
                r.keywords.forEach((kw) => {
                    keywordMap[kw] = (keywordMap[kw] || 0) + 1;
                });
            }
        });
        const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;
        const responseRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0;
        const topKeywords = Object.entries(keywordMap)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        return {
            totalReviews,
            averageRating,
            responseRate,
            repliedCount,
            unrepliedCount: totalReviews - repliedCount,
            sentimentDistribution: sentimentDist,
            topKeywords,
            ratingDistribution: {
                5: ratingDist[5] || 0,
                4: ratingDist[4] || 0,
                3: ratingDist[3] || 0,
                2: ratingDist[2] || 0,
                1: ratingDist[1] || 0,
            },
        };
    }
}
exports.ReviewAnalyticsService = ReviewAnalyticsService;
exports.default = ReviewAnalyticsService;
