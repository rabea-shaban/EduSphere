import { Types } from 'mongoose';
import { Review } from '../review.model';
import { Course } from '../../courses/course.model';

export interface RatingBreakdown {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: { count: number; percentage: number };
    4: { count: number; percentage: number };
    3: { count: number; percentage: number };
    2: { count: number; percentage: number };
    1: { count: number; percentage: number };
  };
}

export class RatingService {
  /**
   * Recalculates course ratings, updates Course document, and returns 5-star distribution.
   */
  static async recalculateCourseRating(courseId: Types.ObjectId | string): Promise<RatingBreakdown> {
    const cid = new Types.ObjectId(courseId);

    const agg = await Review.aggregate([
      { $match: { courseId: cid, status: 'APPROVED' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let weightedSum = 0;

    agg.forEach((item) => {
      const r = Number(item._id);
      if (r >= 1 && r <= 5) {
        counts[r] = item.count;
        totalReviews += item.count;
        weightedSum += r * item.count;
      }
    });

    const averageRating = totalReviews > 0 ? Number((weightedSum / totalReviews).toFixed(1)) : 0;

    // Update Course model
    await Course.findByIdAndUpdate(cid, {
      rating: averageRating,
      reviewCount: totalReviews,
    });

    const calcPercentage = (cnt: number) => (totalReviews > 0 ? Math.round((cnt / totalReviews) * 100) : 0);

    return {
      averageRating,
      totalReviews,
      distribution: {
        5: { count: counts[5], percentage: calcPercentage(counts[5]) },
        4: { count: counts[4], percentage: calcPercentage(counts[4]) },
        3: { count: counts[3], percentage: calcPercentage(counts[3]) },
        2: { count: counts[2], percentage: calcPercentage(counts[2]) },
        1: { count: counts[1], percentage: calcPercentage(counts[1]) },
      },
    };
  }
}

export default RatingService;
