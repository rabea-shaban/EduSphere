import { Request, Response } from 'express';
import { User } from '../users/user.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Payment } from '../payments/payment.model';
import { ExamAttempt } from '../examAttempts/examAttempt.model';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get core platform analytics.
 * Supports date range query filters.
 */
export const getPlatformAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const dateFilter: any = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string);
  }

  // 1. Enrollment Growth (grouped by month)
  const enrollmentGrowth = await Enrollment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 2. Revenue Growth (grouped by month)
  const revenueGrowth = await Payment.aggregate([
    {
      $match: {
        status: 'Paid',
        ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}),
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalRevenue: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 3. User Growth (grouped by month)
  const userGrowth = await User.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 4. Daily Active Users (DAU) & Monthly Active Users (MAU)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const dauAgg = await ActivityLog.aggregate([
    {
      $match: {
        category: 'Login',
        createdAt: { $gte: startOfToday },
      },
    },
    { $group: { _id: '$userId' } },
    { $count: 'dau' },
  ]);

  const mauAgg = await ActivityLog.aggregate([
    {
      $match: {
        category: 'Login',
        createdAt: { $gte: startOfMonth },
      },
    },
    { $group: { _id: '$userId' } },
    { $count: 'mau' },
  ]);

  const dau = dauAgg[0]?.dau || 0;
  const mau = mauAgg[0]?.mau || 0;

  // 5. Quiz Performance (average score)
  const quizPerformanceAgg = await ExamAttempt.aggregate([
    { $group: { _id: null, averagePercentage: { $avg: '$percentage' } } },
  ]);
  const averageQuizScore = Math.round(quizPerformanceAgg[0]?.averagePercentage || 0);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        enrollmentGrowth,
        revenueGrowth,
        userGrowth,
        activeUsers: {
          dau,
          mau,
          ratio: mau > 0 ? (dau / mau).toFixed(2) : '0.00',
        },
        quizPerformance: {
          averageQuizScore,
        },
      },
      'Platform analytics retrieved successfully'
    )
  );
});
export default getPlatformAnalytics;
