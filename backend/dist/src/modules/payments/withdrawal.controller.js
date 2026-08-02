"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelTeacherWithdrawal = exports.createTeacherWithdrawal = exports.getTeacherWithdrawalById = exports.getTeacherWithdrawals = exports.getTeacherWalletHistory = exports.getTeacherWallet = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("../courses/course.model");
const payment_model_1 = require("./payment.model");
const withdrawal_model_1 = require("./withdrawal.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
const enrollment_model_1 = require("../enrollments/enrollment.model");
const MIN_WITHDRAWAL_AMOUNT = 100; // 100 EGP
async function getTeacherCourseIds(userId, _userRole) {
    const teacherCourses = await course_model_1.Course.find({ teacher: new mongoose_1.Types.ObjectId(userId), isDeleted: { $ne: true } }).select('_id').lean();
    return teacherCourses.map((c) => c._id);
}
async function calculateTeacherWallet(userId, userRole) {
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
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
    ]);
    const grossFromPayments = paidAgg[0]?.total || 0;
    const grossFromEnrollments = enrollmentAgg[0]?.total || 0;
    const grossRevenue = Math.max(grossFromPayments, grossFromEnrollments);
    const lifetimeEarnings = Math.round(grossRevenue * 0.85);
    const totalWithdrawn = withdrawnAgg[0]?.total || 0;
    const pendingBalance = pendingWithdrawalAgg[0]?.total || 0;
    const activePendingCount = pendingWithdrawalAgg[0]?.count || 0;
    const availableBalance = Math.max(0, lifetimeEarnings - totalWithdrawn - pendingBalance);
    return {
        grossRevenue,
        lifetimeEarnings,
        totalWithdrawn,
        pendingBalance,
        availableBalance,
        activePendingCount,
        currency: 'EGP',
        minWithdrawalAmount: MIN_WITHDRAWAL_AMOUNT,
    };
}
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Payment',
        module: 'Withdrawals',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Controllers ─────────────────────────────────────────────────────────────
/**
 * GET /teacher/wallet
 * Returns real-time wallet balance metrics.
 */
exports.getTeacherWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const wallet = await calculateTeacherWallet(userId, userRole);
    await logActivity(userId, userName, userRole, 'WALLET_VIEWED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, wallet, 'Wallet summary retrieved successfully'));
});
/**
 * GET /teacher/wallet/history
 */
exports.getTeacherWalletHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const withdrawals = await withdrawal_model_1.Withdrawal.find({ teacherId: new mongoose_1.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, withdrawals, 'Wallet history retrieved successfully'));
});
/**
 * GET /teacher/withdrawals
 * List withdrawal requests with filters, search, and pagination.
 */
exports.getTeacherWithdrawals = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, status, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const filter = {};
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        filter.teacherId = new mongoose_1.Types.ObjectId(userId);
    }
    if (status && status !== 'ALL') {
        filter.status = status;
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest')
        sortOption = { createdAt: 1 };
    if (sort === 'highest_amount')
        sortOption = { amount: -1 };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const withdrawals = await withdrawal_model_1.Withdrawal.find(filter)
        .populate('teacherId', 'firstName lastName email phone')
        .sort(sortOption)
        .lean();
    let formatted = withdrawals.map((w) => ({
        _id: w._id,
        withdrawalId: `WTH-${String(w._id).slice(-8).toUpperCase()}`,
        amount: w.amount,
        method: w.method,
        accountDetails: w.accountDetails,
        status: w.status,
        requestedAt: w.requestedAt || w.createdAt,
        processedAt: w.processedAt,
        rejectionReason: w.rejectionReason,
        teacherName: w.teacherId ? `${w.teacherId.firstName || ''} ${w.teacherId.lastName || ''}`.trim() : 'محاضر',
        teacherEmail: w.teacherId?.email || '',
    }));
    if (search) {
        const s = search.toLowerCase();
        formatted = formatted.filter((w) => w.withdrawalId.toLowerCase().includes(s) ||
            w.method.toLowerCase().includes(s) ||
            w.accountDetails.toLowerCase().includes(s) ||
            w.teacherName.toLowerCase().includes(s));
    }
    const total = formatted.length;
    const paginated = formatted.slice(skip, skip + limitNum);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        withdrawals: paginated,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Withdrawals list retrieved successfully'));
});
/**
 * GET /teacher/withdrawals/:id
 */
exports.getTeacherWithdrawalById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const withdrawal = await withdrawal_model_1.Withdrawal.findById(id).populate('teacherId', 'firstName lastName email phone');
    if (!withdrawal) {
        throw new ApiError_1.ApiError(404, 'Withdrawal request not found');
    }
    if (withdrawal.teacherId._id.toString() !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        throw new ApiError_1.ApiError(403, 'Access denied. You do not own this withdrawal request.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, withdrawal, 'Withdrawal details retrieved successfully'));
});
/**
 * POST /teacher/withdrawals
 * Create a new withdrawal request with strict server-side checks.
 */
exports.createTeacherWithdrawal = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { amount, method, accountDetails } = req.body;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < MIN_WITHDRAWAL_AMOUNT) {
        throw new ApiError_1.ApiError(400, `الحد الأدنى لمبلغ السحب هو ${MIN_WITHDRAWAL_AMOUNT} جنيه مصري`);
    }
    if (!accountDetails || !accountDetails.trim()) {
        throw new ApiError_1.ApiError(400, 'يرجى إدخال بيانات رقم المحفظة أو الحساب البنكي لتحويل مستحقاتك');
    }
    const wallet = await calculateTeacherWallet(userId, userRole);
    if (wallet.activePendingCount > 0) {
        throw new ApiError_1.ApiError(400, 'يوجد لديك طلب سحب رصيد قيد المعالجة بالفعل. يرجى انتظار كود السحب أو مراجعة الإدارة قبل تقديم طلب جديد');
    }
    if (numAmount > wallet.availableBalance) {
        throw new ApiError_1.ApiError(400, `المبلغ المطلوب (${numAmount} ج.م) يتجاوز الرصيد المتاح حالياً للسحب (${wallet.availableBalance} ج.م)`);
    }
    const withdrawal = await withdrawal_model_1.Withdrawal.create({
        teacherId: new mongoose_1.Types.ObjectId(userId),
        amount: numAmount,
        method: method || 'Vodafone Cash',
        accountDetails: accountDetails.trim(),
        status: 'Pending',
        requestedAt: new Date(),
    });
    await logActivity(userId, userName, userRole, 'WITHDRAWAL_REQUESTED', {
        withdrawalId: withdrawal._id,
        amount: numAmount,
        method: withdrawal.method,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, withdrawal, 'تم إرسال طلب سحب المستحقات بنجاح وفي انتظار مراجعة الإدارة 🎉'));
});
/**
 * PATCH /teacher/withdrawals/:id/cancel
 * Cancel a pending withdrawal request.
 */
exports.cancelTeacherWithdrawal = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const withdrawal = await withdrawal_model_1.Withdrawal.findById(id);
    if (!withdrawal) {
        throw new ApiError_1.ApiError(404, 'Withdrawal request not found');
    }
    if (withdrawal.teacherId.toString() !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        throw new ApiError_1.ApiError(403, 'Access denied. You do not own this withdrawal request.');
    }
    if (withdrawal.status !== 'Pending') {
        throw new ApiError_1.ApiError(400, 'يمكن إلغاء الطلبات المعلقة فقط. الطلبات المقبولة أو المكتملة لا يمكن إلغاؤها');
    }
    withdrawal.status = 'Cancelled';
    await withdrawal.save();
    await logActivity(userId, userName, userRole, 'WITHDRAWAL_CANCELLED', {
        withdrawalId: withdrawal._id,
        amount: withdrawal.amount,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, withdrawal, 'تم إلغاء طلب السحب واستعادة المبلغ للرصيد المتاح بنجاح 🔄'));
});
