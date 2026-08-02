"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherRefunds = exports.getTeacherFinancialReports = exports.getTeacherRevenueBreakdown = exports.requestTeacherPayout = exports.getTeacherPayouts = exports.getTeacherTransactionById = exports.getTeacherTransactions = exports.getTeacherEarningsDashboard = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("../courses/course.model");
const payment_model_1 = require("./payment.model");
const withdrawal_model_1 = require("./withdrawal.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
async function getTeacherCourseIds(userId, _userRole, requestedCourseId) {
    if (requestedCourseId && mongoose_1.Types.ObjectId.isValid(requestedCourseId)) {
        return [new mongoose_1.Types.ObjectId(requestedCourseId)];
    }
    const teacherCourses = await course_model_1.Course.find({ teacher: new mongoose_1.Types.ObjectId(userId), isDeleted: { $ne: true } }).select('_id').lean();
    return teacherCourses.map((c) => c._id);
}
function logActivity(userId, userName, userRole, action, details) {
    activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Payment',
        module: 'Earnings',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Controllers ─────────────────────────────────────────────────────────────
/**
 * GET /teacher/earnings/dashboard
 * Calculates total earnings, available balance, pending withdrawals, and lifetime revenue.
 */
exports.getTeacherEarningsDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole, req.query.courseId);
    // 1. Gross Paid Revenue (from Payments AND Enrollments)
    const [paidAgg, enrollmentAgg, pendingAgg, withdrawnAgg, pendingWithdrawalAgg] = await Promise.all([
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' }, count: { $sum: 1 } } },
        ]),
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Pending' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: { $in: ['Pending', 'Approved', 'UnderReview', 'Processing'] } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);
    const grossFromPayments = paidAgg[0]?.total || 0;
    const grossFromEnrollments = enrollmentAgg[0]?.total || 0;
    const grossRevenue = Math.max(grossFromPayments, grossFromEnrollments);
    const totalTransactionsCount = Math.max(paidAgg[0]?.count || 0, enrollmentAgg[0]?.count || 0);
    // Teacher share 85%
    const teacherShare = Math.round(grossRevenue * 0.85);
    const pendingBalance = Math.round((pendingAgg[0]?.total || 0) * 0.85);
    const withdrawnAmount = withdrawnAgg[0]?.total || 0;
    const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;
    // Available Balance
    const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);
    // Time ranges: Today, This Week, This Month
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const [todayP, todayE, weekP, weekE, monthP, monthE, lastP, lastE] = await Promise.all([
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid', createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid', createdAt: { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
    ]);
    const dailyEarnings = Math.round(Math.max(todayP[0]?.total || 0, todayE[0]?.total || 0) * 0.85);
    const weeklyEarnings = Math.round(Math.max(weekP[0]?.total || 0, weekE[0]?.total || 0) * 0.85);
    const monthlyEarnings = Math.round(Math.max(monthP[0]?.total || 0, monthE[0]?.total || 0) * 0.85);
    const lastMonthEarnings = Math.round(Math.max(lastP[0]?.total || 0, lastE[0]?.total || 0) * 0.85);
    const revenueGrowth = lastMonthEarnings > 0
        ? Math.round(((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
        : 0;
    logActivity(userId, userName, userRole, 'FINANCIAL_DASHBOARD_VIEWED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalEarnings: teacherShare,
        availableBalance,
        pendingBalance,
        withdrawnAmount,
        pendingWithdrawalAmount,
        monthlyEarnings,
        weeklyEarnings,
        dailyEarnings,
        lifetimeRevenue: grossRevenue,
        revenueGrowth,
        totalTransactionsCount,
        teacherSharePercentage: 85,
        currency: 'EGP',
    }, 'Earnings dashboard data retrieved successfully'));
});
/**
 * GET /teacher/earnings/transactions
 * Filterable, searchable list of transactions for teacher's courses.
 */
exports.getTeacherTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, courseId, status, paymentMethod, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole, courseId);
    const filter = { courseId: { $in: teacherCourseIds } };
    if (status && status !== 'ALL') {
        filter.status = status;
    }
    if (paymentMethod && paymentMethod !== 'ALL') {
        filter.paymentMethod = paymentMethod;
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest')
        sortOption = { createdAt: 1 };
    if (sort === 'highest_amount')
        sortOption = { amount: -1 };
    if (sort === 'lowest_amount')
        sortOption = { amount: 1 };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const [payments, enrollments] = await Promise.all([
        payment_model_1.Payment.find(filter)
            .populate('studentId', 'firstName lastName email username phone avatar')
            .populate('courseId', 'title thumbnail category price')
            .sort(sortOption)
            .exec(),
        enrollment_model_1.Enrollment.find({ courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid' })
            .populate('studentId', 'firstName lastName email username phone avatar')
            .populate('courseId', 'title thumbnail category price')
            .sort({ createdAt: -1 })
            .exec(),
    ]);
    let paymentList = payments.map((p) => {
        const student = p.studentId;
        const course = p.courseId;
        const studentName = student
            ? `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.username || student.email
            : 'طالب EduSphere';
        return {
            _id: p._id,
            transactionId: p.paymentReference || `TXN-${String(p._id).slice(-8).toUpperCase()}`,
            studentId: student?._id,
            studentName,
            studentEmail: student?.email || '',
            courseId: course?._id,
            courseTitle: course?.title || 'كورس تعليمي',
            amount: p.amount,
            teacherShare: Math.round(p.amount * 0.85),
            currency: p.currency || 'EGP',
            paymentMethod: p.paymentMethod || 'Vodafone Cash',
            status: p.status,
            paidAt: p.paidAt || p.createdAt,
            createdAt: p.createdAt,
        };
    });
    if (paymentList.length === 0 && enrollments.length > 0) {
        paymentList = enrollments.map((e) => {
            const student = e.studentId;
            const course = e.courseId;
            const studentName = student
                ? `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.username || student.email
                : 'طالب EduSphere';
            return {
                _id: e._id,
                transactionId: e.transactionId || `ENR-${String(e._id).slice(-8).toUpperCase()}`,
                studentId: student?._id,
                studentName,
                studentEmail: student?.email || '',
                courseId: course?._id,
                courseTitle: course?.title || 'كورس تعليمي',
                amount: e.purchasePrice || (course?.price || 0),
                teacherShare: Math.round((e.purchasePrice || (course?.price || 0)) * 0.85),
                currency: 'EGP',
                paymentMethod: e.paymentMethod || 'Vodafone Cash',
                status: 'Paid',
                paidAt: e.enrolledAt || e.createdAt,
                createdAt: e.createdAt,
            };
        });
    }
    let filteredPayments = paymentList;
    if (search) {
        const s = search.toLowerCase();
        filteredPayments = filteredPayments.filter((p) => p.transactionId.toLowerCase().includes(s) ||
            p.studentName.toLowerCase().includes(s) ||
            p.studentEmail.toLowerCase().includes(s) ||
            p.courseTitle.toLowerCase().includes(s));
    }
    const total = filteredPayments.length;
    const paginated = filteredPayments.slice(skip, skip + limitNum);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        transactions: paginated,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
        },
    }, 'Transactions list retrieved successfully'));
});
/**
 * GET /teacher/earnings/transactions/:id
 */
exports.getTeacherTransactionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    let payment = await payment_model_1.Payment.findById(id)
        .populate('studentId', 'firstName lastName email username phone avatar')
        .populate('courseId', 'title thumbnail category price teacher');
    if (!payment) {
        const enrollment = await enrollment_model_1.Enrollment.findById(id)
            .populate('studentId', 'firstName lastName email username phone avatar')
            .populate('courseId', 'title thumbnail category price teacher');
        if (enrollment) {
            payment = {
                _id: enrollment._id,
                paymentReference: enrollment.transactionId || `ENR-${String(enrollment._id).slice(-8).toUpperCase()}`,
                studentId: enrollment.studentId,
                courseId: enrollment.courseId,
                amount: enrollment.purchasePrice || 0,
                paymentMethod: enrollment.paymentMethod || 'Vodafone Cash',
                status: 'Paid',
                createdAt: enrollment.createdAt,
            };
        }
    }
    if (!payment) {
        throw new ApiError_1.ApiError(404, 'Transaction not found');
    }
    const courseTeacherId = payment.courseId?.teacher?.toString();
    if (courseTeacherId !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        throw new ApiError_1.ApiError(403, 'Access denied. You do not own this course transaction.');
    }
    logActivity(userId, userName, userRole, 'TRANSACTION_VIEWED', { paymentId: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'Transaction details retrieved successfully'));
});
/**
 * GET /teacher/earnings/payouts
 * Withdrawal history & available balance.
 */
exports.getTeacherPayouts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    const [paidAgg, enrollmentAgg, withdrawnAgg, pendingWithdrawalAgg] = await Promise.all([
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: { $in: ['Pending', 'Approved', 'UnderReview', 'Processing'] } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);
    const grossFromPayments = paidAgg[0]?.total || 0;
    const grossFromEnrollments = enrollmentAgg[0]?.total || 0;
    const grossRevenue = Math.max(grossFromPayments, grossFromEnrollments);
    const teacherShare = Math.round(grossRevenue * 0.85);
    const withdrawnAmount = withdrawnAgg[0]?.total || 0;
    const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;
    const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);
    const withdrawals = await withdrawal_model_1.Withdrawal.find({ teacherId: new mongoose_1.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        availableBalance,
        withdrawnAmount,
        pendingWithdrawalAmount,
        withdrawals,
    }, 'Payouts data retrieved successfully'));
});
/**
 * POST /teacher/earnings/payouts
 * Request withdrawal payout.
 */
exports.requestTeacherPayout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { amount, method, accountDetails } = req.body;
    if (!amount || amount <= 0) {
        throw new ApiError_1.ApiError(400, 'يرجى تحديد مبلغ سحب صحيح أكبر من الصفر');
    }
    if (!accountDetails || !accountDetails.trim()) {
        throw new ApiError_1.ApiError(400, 'يرجى إدخال بيانات رقم المحفظة / الحساب البنكي لتبادل المستحقات');
    }
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    const [paidAgg, enrollmentAgg, withdrawnAgg, pendingWithdrawalAgg] = await Promise.all([
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        withdrawal_model_1.Withdrawal.aggregate([
            { $match: { teacherId: new mongoose_1.Types.ObjectId(userId), status: { $in: ['Pending', 'Approved', 'UnderReview', 'Processing'] } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);
    const grossFromPayments = paidAgg[0]?.total || 0;
    const grossFromEnrollments = enrollmentAgg[0]?.total || 0;
    const grossRevenue = Math.max(grossFromPayments, grossFromEnrollments);
    const teacherShare = Math.round(grossRevenue * 0.85);
    const withdrawnAmount = withdrawnAgg[0]?.total || 0;
    const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;
    const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);
    if (amount > availableBalance) {
        throw new ApiError_1.ApiError(400, `المبلغ المطلوب (${amount} ج.م) يتجاوز الرصيد المتاح حالياً للسحب (${availableBalance} ج.م)`);
    }
    const withdrawal = await withdrawal_model_1.Withdrawal.create({
        teacherId: new mongoose_1.Types.ObjectId(userId),
        amount: Number(amount),
        method: method || 'Vodafone Cash',
        accountDetails: accountDetails.trim(),
        status: 'Pending',
        requestedAt: new Date(),
    });
    logActivity(userId, userName, userRole, 'PAYOUT_REQUESTED', {
        withdrawalId: withdrawal._id,
        amount,
        method,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, withdrawal, 'تم تقديم طلب سحب الرصيد بنجاح وفي انتظار مراجعة الإدارة 🎉'));
});
/**
 * GET /teacher/earnings/revenue
 */
exports.getTeacherRevenueBreakdown = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    const monthlyRevenue = await payment_model_1.Payment.aggregate([
        { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                gross: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const mappedMonthly = monthlyRevenue.map((m) => ({
        month: m._id,
        gross: m.gross,
        net: Math.round(m.gross * 0.85),
        transactionsCount: m.count,
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, mappedMonthly, 'Revenue breakdown retrieved successfully'));
});
/**
 * GET /teacher/earnings/reports
 */
exports.getTeacherFinancialReports = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    const [paidAgg, enrollmentAgg, refundedAgg] = await Promise.all([
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        enrollment_model_1.Enrollment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$purchasePrice' }, count: { $sum: 1 } } },
        ]),
        payment_model_1.Payment.aggregate([
            { $match: { courseId: { $in: teacherCourseIds }, status: 'Refunded' } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
    ]);
    const grossRevenue = Math.max(paidAgg[0]?.total || 0, enrollmentAgg[0]?.total || 0);
    const netRevenue = Math.round(grossRevenue * 0.85);
    const refundedAmount = refundedAgg[0]?.total || 0;
    if (req.query.export === 'true') {
        logActivity(userId, userName, userRole, 'FINANCIAL_REPORT_EXPORTED', { format: req.query.format || 'CSV' });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        grossRevenue,
        netRevenue,
        platformFee: grossRevenue - netRevenue,
        refundedAmount,
        paidTransactionsCount: Math.max(paidAgg[0]?.count || 0, enrollmentAgg[0]?.count || 0),
        refundedTransactionsCount: refundedAgg[0]?.count || 0,
        generatedAt: new Date(),
    }, 'Financial report generated successfully'));
});
/**
 * GET /teacher/earnings/refunds
 */
exports.getTeacherRefunds = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    const refunds = await payment_model_1.Payment.find({
        courseId: { $in: teacherCourseIds },
        status: 'Refunded',
    })
        .populate('studentId', 'firstName lastName email')
        .populate('courseId', 'title')
        .sort({ updatedAt: -1 })
        .lean();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, refunds, 'Refunds retrieved successfully'));
});
