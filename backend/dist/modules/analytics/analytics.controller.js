"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformAnalytics = void 0;
const user_model_1 = require("../users/user.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const payment_model_1 = require("../payments/payment.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get core platform analytics.
 * Supports date range query filters.
 */
exports.getPlatformAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate)
            dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate)
            dateFilter.createdAt.$lte = new Date(endDate);
    }
    // 1. Enrollment Growth (grouped by month)
    const enrollmentGrowth = await enrollment_model_1.Enrollment.aggregate([
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
    const revenueGrowth = await payment_model_1.Payment.aggregate([
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
    const userGrowth = await user_model_1.User.aggregate([
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
    const dauAgg = await activityLog_model_1.ActivityLog.aggregate([
        {
            $match: {
                category: 'Login',
                createdAt: { $gte: startOfToday },
            },
        },
        { $group: { _id: '$userId' } },
        { $count: 'dau' },
    ]);
    const mauAgg = await activityLog_model_1.ActivityLog.aggregate([
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
    const quizPerformanceAgg = await examAttempt_model_1.ExamAttempt.aggregate([
        { $group: { _id: null, averagePercentage: { $avg: '$percentage' } } },
    ]);
    const averageQuizScore = Math.round(quizPerformanceAgg[0]?.averagePercentage || 0);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
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
    }, 'Platform analytics retrieved successfully'));
});
exports.default = exports.getPlatformAnalytics;
