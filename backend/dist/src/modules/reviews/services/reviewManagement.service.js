"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewManagementService = void 0;
const mongoose_1 = require("mongoose");
const review_model_1 = require("../review.model");
const course_model_1 = require("../../courses/course.model");
const enrollment_model_1 = require("../../enrollments/enrollment.model");
const ApiError_1 = require("../../../utils/ApiError");
const sentimentAnalysis_service_1 = require("./sentimentAnalysis.service");
const rating_service_1 = require("./rating.service");
const reviewNotification_service_1 = require("./reviewNotification.service");
class ReviewManagementService {
    /**
     * Submits or updates a student review for a course.
     */
    static async submitReview(courseId, studentId, studentName, rating, comment, title) {
        const cid = new mongoose_1.Types.ObjectId(courseId);
        const sid = new mongoose_1.Types.ObjectId(studentId);
        const course = await course_model_1.Course.findById(cid).select('_id title').lean();
        if (!course) {
            throw new ApiError_1.ApiError(404, 'Course not found');
        }
        // Verify enrollment
        const isEnrolled = await enrollment_model_1.Enrollment.findOne({
            studentId: sid,
            courseId: cid,
            status: { $in: ['Active', 'Completed'] },
        }).lean();
        if (!isEnrolled) {
            throw new ApiError_1.ApiError(403, 'يمكنك فقط تقديم تقييم ومراجعة للكورسات المشترك بها بالفعل');
        }
        // Sentiment analysis
        const { sentiment, keywords } = sentimentAnalysis_service_1.SentimentAnalysisService.analyze(comment, rating);
        // Upsert review
        let review = await review_model_1.Review.findOne({ courseId: cid, studentId: sid });
        if (review) {
            review.rating = rating;
            review.comment = comment.trim();
            if (title)
                review.title = title.trim();
            review.sentiment = sentiment;
            review.keywords = keywords;
            review.status = 'APPROVED';
            await review.save();
        }
        else {
            review = await review_model_1.Review.create({
                courseId: cid,
                studentId: sid,
                rating,
                title: title?.trim(),
                comment: comment.trim(),
                sentiment,
                keywords,
                status: 'APPROVED',
            });
        }
        // Recalculate average rating & update course
        await rating_service_1.RatingService.recalculateCourseRating(cid);
        // Notify teacher
        await reviewNotification_service_1.ReviewNotificationService.notifyTeacherOnNewReview(cid, studentName, rating);
        return review;
    }
    /**
     * Retrieves approved reviews for a specific course with rating distribution.
     */
    static async getCourseReviews(courseId, page = 1, limit = 10, starFilter) {
        const cid = new mongoose_1.Types.ObjectId(courseId);
        const filter = { courseId: cid, status: 'APPROVED' };
        if (starFilter && starFilter >= 1 && starFilter <= 5) {
            filter.rating = starFilter;
        }
        const skip = (page - 1) * limit;
        const reviews = await review_model_1.Review.find(filter)
            .populate('studentId', 'firstName lastName avatar username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await review_model_1.Review.countDocuments(filter);
        const breakdown = await rating_service_1.RatingService.recalculateCourseRating(cid);
        return {
            reviews,
            ratingSummary: breakdown,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Retrieves all reviews for a teacher's courses.
     */
    static async getTeacherReviews(teacherId, userRole, page = 1, limit = 15, courseId, hasReply) {
        let teacherCourseIds = [];
        if (courseId && mongoose_1.Types.ObjectId.isValid(courseId)) {
            teacherCourseIds = [new mongoose_1.Types.ObjectId(courseId)];
        }
        else if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
            const allCourses = await course_model_1.Course.find({ isDeleted: { $ne: true } }).select('_id').lean();
            teacherCourseIds = allCourses.map((c) => c._id);
        }
        else {
            const teacherCourses = await course_model_1.Course.find({ teacher: new mongoose_1.Types.ObjectId(teacherId), isDeleted: { $ne: true } }).select('_id').lean();
            teacherCourseIds = teacherCourses.map((c) => c._id);
        }
        const filter = { courseId: { $in: teacherCourseIds }, status: 'APPROVED' };
        if (hasReply === true) {
            filter['teacherReply.replyText'] = { $exists: true, $ne: '' };
        }
        else if (hasReply === false) {
            filter['teacherReply.replyText'] = { $exists: false };
        }
        const skip = (page - 1) * limit;
        const reviews = await review_model_1.Review.find(filter)
            .populate('studentId', 'firstName lastName email avatar username')
            .populate('courseId', 'title thumbnail category')
            .sort({ createdAt: -1 })
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
    /**
     * Votes "Helpful" on a review.
     */
    static async voteHelpful(reviewId, userId) {
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new ApiError_1.ApiError(404, 'Review not found');
        }
        const uid = new mongoose_1.Types.ObjectId(userId);
        const existingIndex = review.helpfulVotes.userIds.findIndex((id) => id.toString() === userId);
        if (existingIndex > -1) {
            review.helpfulVotes.userIds.splice(existingIndex, 1);
            review.helpfulVotes.count = Math.max(0, review.helpfulVotes.count - 1);
        }
        else {
            review.helpfulVotes.userIds.push(uid);
            review.helpfulVotes.count += 1;
        }
        await review.save();
        return review;
    }
}
exports.ReviewManagementService = ReviewManagementService;
exports.default = ReviewManagementService;
