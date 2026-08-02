"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherReplyService = void 0;
const review_model_1 = require("../review.model");
const course_model_1 = require("../../courses/course.model");
const ApiError_1 = require("../../../utils/ApiError");
const reviewNotification_service_1 = require("./reviewNotification.service");
class TeacherReplyService {
    /**
     * Adds or updates teacher's official reply on a review.
     */
    static async addOrUpdateReply(reviewId, teacherId, userRole, replyText) {
        if (!replyText || !replyText.trim()) {
            throw new ApiError_1.ApiError(400, 'يرجى كتابة نص رد المحاضر قبل الحفظ');
        }
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new ApiError_1.ApiError(404, 'Review not found');
        }
        const course = await course_model_1.Course.findById(review.courseId).select('teacher').lean();
        if (!course) {
            throw new ApiError_1.ApiError(404, 'Associated course not found');
        }
        const isTeacherOwner = course.teacher?.toString() === teacherId;
        if (!isTeacherOwner && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
            throw new ApiError_1.ApiError(403, 'غير مسموح. يمكنك فقط الرد على مراجعات الكورسات الخاصة بك');
        }
        review.teacherReply = {
            replyText: replyText.trim(),
            repliedAt: review.teacherReply?.repliedAt || new Date(),
            updatedAt: new Date(),
        };
        await review.save();
        // Trigger notification
        await reviewNotification_service_1.ReviewNotificationService.notifyStudentOnTeacherReply(review.studentId, review.courseId);
        return review;
    }
    /**
     * Deletes teacher's official reply.
     */
    static async deleteReply(reviewId, teacherId, userRole) {
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new ApiError_1.ApiError(404, 'Review not found');
        }
        const course = await course_model_1.Course.findById(review.courseId).select('teacher').lean();
        if (!course) {
            throw new ApiError_1.ApiError(404, 'Associated course not found');
        }
        const isTeacherOwner = course.teacher?.toString() === teacherId;
        if (!isTeacherOwner && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
            throw new ApiError_1.ApiError(403, 'غير مسموح. يمكنك فقط حذف الردود على الكورسات الخاصة بك');
        }
        review.teacherReply = undefined;
        await review.save();
        return review;
    }
}
exports.TeacherReplyService = TeacherReplyService;
exports.default = TeacherReplyService;
