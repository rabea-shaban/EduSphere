import { Types } from 'mongoose';
import { Course } from '../../courses/course.model';
import { Enrollment } from '../../enrollments/enrollment.model';
import { Payment } from '../../payments/payment.model';
import { Review } from '../../reviews/review.model';

export interface TeacherProfileAnalytics {
  coursesPublished: number;
  studentsEnrolled: number;
  averageRating: number;
  totalReviews: number;
  totalRevenue: number;
}

export class ProfileAnalyticsService {
  /**
   * Generates profile performance metrics for a teacher.
   */
  static async getAnalytics(userId: string): Promise<TeacherProfileAnalytics> {
    const teacherId = new Types.ObjectId(userId);

    const courses = await Course.find({ teacher: teacherId, isDeleted: { $ne: true } }).select('_id rating reviewCount').lean();
    const courseIds = courses.map((c: any) => c._id);

    const coursesPublished = courses.length;

    const studentsEnrolled = await Enrollment.countDocuments({
      courseId: { $in: courseIds },
      status: { $in: ['Active', 'Completed'] },
    });

    const revAgg = await Payment.aggregate([
      { $match: { courseId: { $in: courseIds }, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = Math.round((revAgg[0]?.total || 0) * 0.85);

    const totalReviews = await Review.countDocuments({
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

export default ProfileAnalyticsService;
