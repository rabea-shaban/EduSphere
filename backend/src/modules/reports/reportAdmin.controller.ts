import { Request, Response } from 'express';
import { Payment } from '../payments/payment.model';
import { Withdrawal } from '../payments/withdrawal.model';
import { User } from '../users/user.model';
import { Course } from '../courses/course.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Main Reports & Analytics Dashboard API.
 * Aggregates real MongoDB data for metrics, charts, and top rankings.
 */
export const getReportsDashboardAdmin = catchAsync(async (_req: Request, res: Response) => {
  // 1. Overall Metrics
  const totalStudents = await User.countDocuments({ role: 'STUDENT' });
  const totalTeachers = await User.countDocuments({ role: 'TEACHER' });
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();
  const completedEnrollments = await Enrollment.countDocuments({ status: 'Completed' });

  // 2. Financial Metrics
  const totalRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = totalRevAgg[0]?.total || 0;

  const pendingPaymentsCount = await Payment.countDocuments({ status: 'Pending' });
  
  const completedWithdrawalsAgg = await Withdrawal.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const completedWithdrawals = completedWithdrawalsAgg[0]?.total || 0;

  // 3. Monthly Revenue Trend (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenueAgg = await Payment.aggregate([
    { $match: { status: 'Paid', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthlyRevenueTrend = monthlyRevenueAgg.map((item) => {
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ];
    return {
      month: monthNames[item._id.month - 1] || `${item._id.month}`,
      revenue: item.revenue,
      sales: item.count,
    };
  });

  // 4. Payment Methods Distribution
  const paymentMethodsAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  const paymentMethodsDistribution = paymentMethodsAgg.map((m) => ({
    method: m._id || 'أخرى',
    total: m.total,
    count: m.count,
  }));

  // 5. Top 5 Courses by Sales/Enrollments
  const rawTopCourses = await Course.find()
    .sort({ totalStudents: -1, createdAt: -1 })
    .limit(5)
    .populate('teacher', 'firstName lastName email');

  const topCourses = rawTopCourses.map((c) => {
    const teacher: any = c.teacher || {};
    const cAny: any = c;
    return {
      _id: c._id,
      title: c.title,
      price: c.price,
      studentsCount: cAny.totalStudents || cAny.enrolledStudentsCount || 0,
      rating: cAny.ratingAverage || cAny.rating || 5.0,
      teacherName: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'محاضر غير محدد',
    };
  });

  // 6. Top 5 Teachers by Courses & Students
  const rawTopTeachers = await User.find({ role: 'TEACHER' })
    .sort({ createdAt: -1 })
    .limit(5);

  const topTeachers = await Promise.all(
    rawTopTeachers.map(async (t) => {
      const coursesCount = await Course.countDocuments({ teacher: t._id });
      const enrollmentsCount = await Enrollment.countDocuments({ teacherId: t._id });

      return {
        _id: t._id,
        fullName: `${t.firstName} ${t.lastName}`,
        email: t.email,
        coursesCount,
        studentsCount: enrollmentsCount,
      };
    })
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalRevenue,
          totalStudents,
          totalTeachers,
          totalCourses,
          totalEnrollments,
          completedEnrollments,
          completionRate: totalEnrollments > 0 ? `${Math.round((completedEnrollments / totalEnrollments) * 100)}%` : '0%',
          pendingPaymentsCount,
          completedWithdrawals,
          certificatesIssued: completedEnrollments,
        },
        monthlyRevenueTrend,
        paymentMethodsDistribution,
        topCourses,
        topTeachers,
      },
      'Reports dashboard data retrieved successfully'
    )
  );
});

/**
 * Detailed Revenue Report.
 */
export const getRevenueReportAdmin = catchAsync(async (_req: Request, res: Response) => {
  const totalRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = totalRevAgg[0]?.total || 0;

  const refundedAgg = await Payment.aggregate([
    { $match: { status: 'Refunded' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  const teacherEarnings = Math.round(totalRevenue * 0.8);
  const platformProfit = Math.round(totalRevenue * 0.2);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue,
        platformProfit,
        teacherEarnings,
        refundedAmount: refundedAgg[0]?.total || 0,
        refundedCount: refundedAgg[0]?.count || 0,
      },
      'Revenue report retrieved successfully'
    )
  );
});

/**
 * Detailed Student Analytics Report.
 */
export const getStudentReportAdmin = catchAsync(async (_req: Request, res: Response) => {
  const totalStudents = await User.countDocuments({ role: 'STUDENT' });
  const activeStudents = await User.countDocuments({ role: 'STUDENT', isActive: true });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
      },
      'Student report retrieved successfully'
    )
  );
});

/**
 * Detailed Teacher Analytics Report.
 */
export const getTeacherReportAdmin = catchAsync(async (_req: Request, res: Response) => {
  const totalTeachers = await User.countDocuments({ role: 'TEACHER' });
  const activeTeachers = await User.countDocuments({ role: 'TEACHER', isActive: true });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalTeachers,
        activeTeachers,
      },
      'Teacher report retrieved successfully'
    )
  );
});
