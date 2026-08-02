"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewNotificationService = void 0;
const notification_model_1 = require("../../notifications/notification.model");
const course_model_1 = require("../../courses/course.model");
class ReviewNotificationService {
    /**
     * Notifies teacher when a student submits a new course review.
     */
    static async notifyTeacherOnNewReview(courseId, studentName, rating) {
        try {
            const course = await course_model_1.Course.findById(courseId).select('teacher title').lean();
            if (!course || !course.teacher)
                return;
            await notification_model_1.Notification.create({
                recipientId: course.teacher,
                senderId: course.teacher, // System/Event
                title: 'تقييم جديد للكورس ⭐️',
                message: `قام الطالب (${studentName}) بتقديم تقييم ${rating} نجوم للكورس (${course.title}).`,
                type: 'Course',
                isRead: false,
            });
        }
        catch { }
    }
    /**
     * Notifies student when teacher posts a reply to their review.
     */
    static async notifyStudentOnTeacherReply(studentId, courseId) {
        try {
            const course = await course_model_1.Course.findById(courseId).select('title').lean();
            const courseTitle = course?.title || 'الكورس';
            await notification_model_1.Notification.create({
                recipientId: studentId,
                senderId: studentId,
                title: 'رد جديد من المحاضر 💬',
                message: `قام المحاضر بالرد على تقييمك لكورس (${courseTitle}).`,
                type: 'Course',
                isRead: false,
            });
        }
        catch { }
    }
}
exports.ReviewNotificationService = ReviewNotificationService;
exports.default = ReviewNotificationService;
