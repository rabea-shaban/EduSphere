"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherReportAdmin = exports.getStudentReportAdmin = exports.getRevenueReportAdmin = exports.getReportsDashboardAdmin = void 0;
const payment_model_1 = require("../payments/payment.model");
const withdrawal_model_1 = require("../payments/withdrawal.model");
const user_model_1 = require("../users/user.model");
const course_model_1 = require("../courses/course.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Main Reports & Analytics Dashboard API.
 * Aggregates real MongoDB data for metrics, charts, and top rankings.
 */
exports.getReportsDashboardAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    // 1. Overall Metrics
    const totalStudents = await user_model_1.User.countDocuments({ role: 'STUDENT' });
    const totalTeachers = await user_model_1.User.countDocuments({ role: 'TEACHER' });
    const totalCourses = await course_model_1.Course.countDocuments();
    const totalEnrollments = await enrollment_model_1.Enrollment.countDocuments();
    const completedEnrollments = await enrollment_model_1.Enrollment.countDocuments({ status: 'Completed' });
    // 2. Financial Metrics
    const totalRevAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevAgg[0]?.total || 0;
    const pendingPaymentsCount = await payment_model_1.Payment.countDocuments({ status: 'Pending' });
    const completedWithdrawalsAgg = await withdrawal_model_1.Withdrawal.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const completedWithdrawals = completedWithdrawalsAgg[0]?.total || 0;
    // 3. Monthly Revenue Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenueAgg = await payment_model_1.Payment.aggregate([
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
    const paymentMethodsAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const paymentMethodsDistribution = paymentMethodsAgg.map((m) => ({
        method: m._id || 'أخرى',
        total: m.total,
        count: m.count,
    }));
    // 5. Top 5 Courses by Sales/Enrollments
    const rawTopCourses = await course_model_1.Course.find()
        .sort({ totalStudents: -1, createdAt: -1 })
        .limit(5)
        .populate('teacher', 'firstName lastName email');
    const topCourses = rawTopCourses.map((c) => {
        const teacher = c.teacher || {};
        const cAny = c;
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
    const rawTopTeachers = await user_model_1.User.find({ role: 'TEACHER' })
        .sort({ createdAt: -1 })
        .limit(5);
    const topTeachers = await Promise.all(rawTopTeachers.map(async (t) => {
        const coursesCount = await course_model_1.Course.countDocuments({ teacher: t._id });
        const enrollmentsCount = await enrollment_model_1.Enrollment.countDocuments({ teacherId: t._id });
        return {
            _id: t._id,
            fullName: `${t.firstName} ${t.lastName}`,
            email: t.email,
            coursesCount,
            studentsCount: enrollmentsCount,
        };
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
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
    }, 'Reports dashboard data retrieved successfully'));
});
/**
 * Detailed Revenue Report.
 */
exports.getRevenueReportAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const totalRevAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevAgg[0]?.total || 0;
    const refundedAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Refunded' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const teacherEarnings = Math.round(totalRevenue * 0.8);
    const platformProfit = Math.round(totalRevenue * 0.2);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalRevenue,
        platformProfit,
        teacherEarnings,
        refundedAmount: refundedAgg[0]?.total || 0,
        refundedCount: refundedAgg[0]?.count || 0,
    }, 'Revenue report retrieved successfully'));
});
/**
 * Detailed Student Analytics Report.
 */
exports.getStudentReportAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const totalStudents = await user_model_1.User.countDocuments({ role: 'STUDENT' });
    const activeStudents = await user_model_1.User.countDocuments({ role: 'STUDENT', isActive: true });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
    }, 'Student report retrieved successfully'));
});
/**
 * Detailed Teacher Analytics Report.
 */
exports.getTeacherReportAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const totalTeachers = await user_model_1.User.countDocuments({ role: 'TEACHER' });
    const activeTeachers = await user_model_1.User.countDocuments({ role: 'TEACHER', isActive: true });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalTeachers,
        activeTeachers,
    }, 'Teacher report retrieved successfully'));
});
