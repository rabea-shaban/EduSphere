import { Types } from 'mongoose';
import { Notification } from '../../notifications/notification.model';
import { Course } from '../../courses/course.model';

export class ReviewNotificationService {
  /**
   * Notifies teacher when a student submits a new course review.
   */
  static async notifyTeacherOnNewReview(courseId: Types.ObjectId, studentName: string, rating: number): Promise<void> {
    try {
      const course = await Course.findById(courseId).select('teacher title').lean();
      if (!course || !course.teacher) return;

      await Notification.create({
        recipientId: course.teacher,
        senderId: course.teacher, // System/Event
        title: 'تقييم جديد للكورس ⭐️',
        message: `قام الطالب (${studentName}) بتقديم تقييم ${rating} نجوم للكورس (${course.title}).`,
        type: 'Course',
        isRead: false,
      });
    } catch {}
  }

  /**
   * Notifies student when teacher posts a reply to their review.
   */
  static async notifyStudentOnTeacherReply(studentId: Types.ObjectId, courseId: Types.ObjectId): Promise<void> {
    try {
      const course = await Course.findById(courseId).select('title').lean();
      const courseTitle = course?.title || 'الكورس';

      await Notification.create({
        recipientId: studentId,
        senderId: studentId,
        title: 'رد جديد من المحاضر 💬',
        message: `قام المحاضر بالرد على تقييمك لكورس (${courseTitle}).`,
        type: 'Course',
        isRead: false,
      });
    } catch {}
  }
}

export default ReviewNotificationService;
