import { Review, IReviewDocument } from '../review.model';
import { Course } from '../../courses/course.model';
import { ApiError } from '../../../utils/ApiError';
import { ReviewNotificationService } from './reviewNotification.service';

export class TeacherReplyService {
  /**
   * Adds or updates teacher's official reply on a review.
   */
  static async addOrUpdateReply(
    reviewId: string,
    teacherId: string,
    userRole: string,
    replyText: string
  ): Promise<IReviewDocument> {
    if (!replyText || !replyText.trim()) {
      throw new ApiError(400, 'يرجى كتابة نص رد المحاضر قبل الحفظ');
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    const course = await Course.findById(review.courseId).select('teacher').lean();
    if (!course) {
      throw new ApiError(404, 'Associated course not found');
    }

    const isTeacherOwner = course.teacher?.toString() === teacherId;
    if (!isTeacherOwner && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      throw new ApiError(403, 'غير مسموح. يمكنك فقط الرد على مراجعات الكورسات الخاصة بك');
    }

    review.teacherReply = {
      replyText: replyText.trim(),
      repliedAt: review.teacherReply?.repliedAt || new Date(),
      updatedAt: new Date(),
    };

    await review.save();

    // Trigger notification
    await ReviewNotificationService.notifyStudentOnTeacherReply(review.studentId, review.courseId);

    return review;
  }

  /**
   * Deletes teacher's official reply.
   */
  static async deleteReply(reviewId: string, teacherId: string, userRole: string): Promise<IReviewDocument> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    const course = await Course.findById(review.courseId).select('teacher').lean();
    if (!course) {
      throw new ApiError(404, 'Associated course not found');
    }

    const isTeacherOwner = course.teacher?.toString() === teacherId;
    if (!isTeacherOwner && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      throw new ApiError(403, 'غير مسموح. يمكنك فقط حذف الردود على الكورسات الخاصة بك');
    }

    review.teacherReply = undefined;
    await review.save();

    return review;
  }
}

export default TeacherReplyService;
