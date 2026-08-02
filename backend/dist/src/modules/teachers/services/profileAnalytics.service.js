"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAnalyticsService = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("../../courses/course.model");
const enrollment_model_1 = require("../../enrollments/enrollment.model");
const payment_model_1 = require("../../payments/payment.model");
const review_model_1 = require("../../reviews/review.model");
class ProfileAnalyticsService {
    /**
     * Generates profile performance metrics for a teacher.
     */
    static async getAnalytics(userId) {
        const teacherId = new mongoose_1.Types.ObjectId(userId);
        const courses = await course_model_1.Course.find({ teacher: teacherId, isDeleted: { $ne: true } }).select('_id rating reviewCount').lean();
        const courseIds = courses.map((c) => c._id);
        const coursesPublished = courses.length;
        const studentsEnrolled = await enrollment_model_1.Enrollment.countDocuments({
            courseId: { $in: courseIds },
            status: { $in: ['Active', 'Completed'] },
        });
        const revAgg = await payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: courseIds }, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalRevenue = Math.round((revAgg[0]?.total || 0) * 0.85);
        const totalReviews = await review_model_1.Review.countDocuments({
            courseId: { $in: courseIds },
            status: 'APPROVED',
        });
        let sumRating = 0;
        courses.forEach((c) => {
            sumRating += c.rating || 0;
        });
        const averageRating = coursesPublished > 0 ? Number((sumRating / coursesPublished).toFixed(1)) : 4.9;
        return {
            coursesPublished,
            studentsEnrolled,
            averageRating,
            totalReviews,
            totalRevenue,
        };
    }
}
exports.ProfileAnalyticsService = ProfileAnalyticsService;
exports.default = ProfileAnalyticsService;
