import { Types } from 'mongoose';
import { Review, IReviewDocument } from '../review.model';
import { Course } from '../../courses/course.model';
import { Enrollment } from '../../enrollments/enrollment.model';
import { ApiError } from '../../../utils/ApiError';
import { SentimentAnalysisService } from './sentimentAnalysis.service';
import { RatingService } from './rating.service';
import { ReviewNotificationService } from './reviewNotification.service';

export class ReviewManagementService {
  /**
   * Submits or updates a student review for a course.
   */
  static async submitReview(
    courseId: string,
    studentId: string,
    studentName: string,
    rating: number,
    comment: string,
    title?: string
  ): Promise<IReviewDocument> {
    const cid = new Types.ObjectId(courseId);
    const sid = new Types.ObjectId(studentId);

    const course = await Course.findById(cid).select('_id title').lean();
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    // Verify enrollment
    const isEnrolled = await Enrollment.findOne({
      studentId: sid,
      courseId: cid,
      status: { $in: ['Active', 'Completed'] },
    }).lean();

    if (!isEnrolled) {
      throw new ApiError(403, 'يمكنك فقط تقديم تقييم ومراجعة للكورسات المشترك بها بالفعل');
    }

    // Sentiment analysis
    const { sentiment, keywords } = SentimentAnalysisService.analyze(comment, rating);

    // Upsert review
    let review = await Review.findOne({ courseId: cid, studentId: sid });

    if (review) {
      review.rating = rating;
      review.comment = comment.trim();
      if (title) review.title = title.trim();
      review.sentiment = sentiment;
      review.keywords = keywords;
      review.status = 'APPROVED';
      await review.save();
    } else {
      review = await Review.create({
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
    await RatingService.recalculateCourseRating(cid);

    // Notify teacher
    await ReviewNotificationService.notifyTeacherOnNewReview(cid, studentName, rating);

    return review;
  }

  /**
   * Retrieves approved reviews for a specific course with rating distribution.
   */
  static async getCourseReviews(courseId: string, page = 1, limit = 10, starFilter?: number) {
    const cid = new Types.ObjectId(courseId);

    const filter: any = { courseId: cid, status: 'APPROVED' };
    if (starFilter && starFilter >= 1 && starFilter <= 5) {
      filter.rating = starFilter;
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate('studentId', 'firstName lastName avatar username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);
    const breakdown = await RatingService.recalculateCourseRating(cid);

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
  static async getTeacherReviews(teacherId: string, userRole: string, page = 1, limit = 15, courseId?: string, hasReply?: boolean) {
    let teacherCourseIds: Types.ObjectId[] = [];

    if (courseId && Types.ObjectId.isValid(courseId)) {
      teacherCourseIds = [new Types.ObjectId(courseId)];
    } else if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      const allCourses = await Course.find({ isDeleted: { $ne: true } }).select('_id').lean();
      teacherCourseIds = allCourses.map((c: any) => c._id);
    } else {
      const teacherCourses = await Course.find({ teacher: new Types.ObjectId(teacherId), isDeleted: { $ne: true } }).select('_id').lean();
      teacherCourseIds = teacherCourses.map((c: any) => c._id);
    }

    const filter: any = { courseId: { $in: teacherCourseIds }, status: 'APPROVED' };
    if (hasReply === true) {
      filter['teacherReply.replyText'] = { $exists: true, $ne: '' };
    } else if (hasReply === false) {
      filter['teacherReply.replyText'] = { $exists: false };
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate('studentId', 'firstName lastName email avatar username')
      .populate('courseId', 'title thumbnail category')
      .sort({ createdAt: -1 })
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

  /**
   * Votes "Helpful" on a review.
   */
  static async voteHelpful(reviewId: string, userId: string): Promise<IReviewDocument> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    const uid = new Types.ObjectId(userId);
    const existingIndex = review.helpfulVotes.userIds.findIndex((id) => id.toString() === userId);

    if (existingIndex > -1) {
      review.helpfulVotes.userIds.splice(existingIndex, 1);
      review.helpfulVotes.count = Math.max(0, review.helpfulVotes.count - 1);
    } else {
      review.helpfulVotes.userIds.push(uid);
      review.helpfulVotes.count += 1;
    }

    await review.save();
    return review;
  }
}

export default ReviewManagementService;
