import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Course } from '../courses/course.model';
import { Payment } from './payment.model';
import { Withdrawal } from './withdrawal.model';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getTeacherCourseIds(userId: string, userRole: string, requestedCourseId?: string): Promise<Types.ObjectId[]> {
  if (requestedCourseId && Types.ObjectId.isValid(requestedCourseId)) {
    return [new Types.ObjectId(requestedCourseId)];
  }
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    const allCourses = await Course.find({ isDeleted: { $ne: true } }).select('_id').lean();
    return allCourses.map((c: any) => c._id);
  }
  const teacherCourses = await Course.find({ teacher: new Types.ObjectId(userId), isDeleted: { $ne: true } }).select('_id').lean();
  return teacherCourses.map((c: any) => c._id);
}

function logActivity(userId: string, userName: string, userRole: string, action: string, details?: object): void {
  ActivityLog.create({
    userId: new Types.ObjectId(userId) as any,
    userName,
    userRole,
    action,
    category: 'Payment',
    module: 'Earnings',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /teacher/earnings/dashboard
 * Calculates total earnings, available balance, pending withdrawals, and lifetime revenue.
 */
export const getTeacherEarningsDashboard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole, req.query.courseId as string);

  // 1. Gross Paid Revenue
  const paidAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const grossRevenue = paidAgg[0]?.total || 0;
  const totalTransactionsCount = paidAgg[0]?.count || 0;

  // Teacher share 85%
  const teacherShare = Math.round(grossRevenue * 0.85);

  // 2. Pending Payments
  const pendingAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Pending' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const pendingBalance = Math.round((pendingAgg[0]?.total || 0) * 0.85);

  // 3. Completed Withdrawals
  const withdrawnAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const withdrawnAmount = withdrawnAgg[0]?.total || 0;

  // 4. Pending Withdrawals
  const pendingWithdrawalAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: { $in: ['Pending', 'Approved'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;

  // 5. Available Balance
  const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);

  // Time ranges: Today, This Week, This Month
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const todayAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfToday } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const dailyEarnings = Math.round((todayAgg[0]?.total || 0) * 0.85);

  const weekAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfWeek } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const weeklyEarnings = Math.round((weekAgg[0]?.total || 0) * 0.85);

  const monthAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const monthlyEarnings = Math.round((monthAgg[0]?.total || 0) * 0.85);

  const lastMonthAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const lastMonthEarnings = Math.round((lastMonthAgg[0]?.total || 0) * 0.85);

  const revenueGrowth = lastMonthEarnings > 0
    ? Math.round(((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)
    : 0;

  await logActivity(userId, userName, userRole, 'FINANCIAL_DASHBOARD_VIEWED');

  res.status(200).json(
    new ApiResponse(
      200,
      {
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
      },
      'Earnings dashboard data retrieved successfully'
    )
  );
});

/**
 * GET /teacher/earnings/transactions
 * Filterable, searchable list of transactions for teacher's courses.
 */
export const getTeacherTransactions = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20, search, courseId, status, paymentMethod, sort } = req.query;
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole, courseId as string);

  const filter: any = { courseId: { $in: teacherCourseIds } };

  if (status && status !== 'ALL') {
    filter.status = status;
  }
  if (paymentMethod && paymentMethod !== 'ALL') {
    filter.paymentMethod = paymentMethod;
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'highest_amount') sortOption = { amount: -1 };
  if (sort === 'lowest_amount') sortOption = { amount: 1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  let query = Payment.find(filter)
    .populate('studentId', 'firstName lastName email username phone avatar')
    .populate('courseId', 'title thumbnail category price')
    .sort(sortOption);

  const payments = await query.exec();

  let filteredPayments = payments.map((p) => {
    const student = p.studentId as any;
    const course = p.courseId as any;
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
      paymentMethod: p.paymentMethod,
      status: p.status,
      paidAt: p.paidAt || p.createdAt,
      createdAt: p.createdAt,
    };
  });

  if (search) {
    const s = (search as string).toLowerCase();
    filteredPayments = filteredPayments.filter((p) =>
      p.transactionId.toLowerCase().includes(s) ||
      p.studentName.toLowerCase().includes(s) ||
      p.studentEmail.toLowerCase().includes(s) ||
      p.courseTitle.toLowerCase().includes(s)
    );
  }

  const total = filteredPayments.length;
  const paginated = filteredPayments.slice(skip, skip + limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Transactions list retrieved successfully'
    )
  );
});

/**
 * GET /teacher/earnings/transactions/:id
 */
export const getTeacherTransactionById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const payment = await Payment.findById(id)
    .populate('studentId', 'firstName lastName email username phone avatar')
    .populate('courseId', 'title thumbnail category price teacher');

  if (!payment) {
    throw new ApiError(404, 'Transaction not found');
  }

  const courseTeacherId = (payment.courseId as any)?.teacher?.toString();
  if (courseTeacherId !== userId && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. You do not own this course transaction.');
  }

  await logActivity(userId, userName, userRole, 'TRANSACTION_VIEWED', { paymentId: id });

  res.status(200).json(new ApiResponse(200, payment, 'Transaction details retrieved successfully'));
});

/**
 * GET /teacher/earnings/payouts
 * Withdrawal history & available balance.
 */
export const getTeacherPayouts = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole);

  const paidAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const grossRevenue = paidAgg[0]?.total || 0;
  const teacherShare = Math.round(grossRevenue * 0.85);

  const withdrawnAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const withdrawnAmount = withdrawnAgg[0]?.total || 0;

  const pendingWithdrawalAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: { $in: ['Pending', 'Approved'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;

  const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);

  const withdrawals = await Withdrawal.find({ teacherId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        availableBalance,
        withdrawnAmount,
        pendingWithdrawalAmount,
        withdrawals,
      },
      'Payouts data retrieved successfully'
    )
  );
});

/**
 * POST /teacher/earnings/payouts
 * Request withdrawal payout.
 */
export const requestTeacherPayout = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { amount, method, accountDetails } = req.body;

  if (!amount || amount <= 0) {
    throw new ApiError(400, 'يرجى تحديد مبلغ سحب صحيح أكبر من الصفر');
  }
  if (!accountDetails || !accountDetails.trim()) {
    throw new ApiError(400, 'يرجى إدخال بيانات رقم المحفظة / الحساب البنكي لتبادل المستحقات');
  }

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole);

  const paidAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const grossRevenue = paidAgg[0]?.total || 0;
  const teacherShare = Math.round(grossRevenue * 0.85);

  const withdrawnAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const withdrawnAmount = withdrawnAgg[0]?.total || 0;

  const pendingWithdrawalAgg = await Withdrawal.aggregate([
    { $match: { teacherId: new Types.ObjectId(userId), status: { $in: ['Pending', 'Approved'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const pendingWithdrawalAmount = pendingWithdrawalAgg[0]?.total || 0;

  const availableBalance = Math.max(0, teacherShare - withdrawnAmount - pendingWithdrawalAmount);

  if (amount > availableBalance) {
    throw new ApiError(400, `المبلغ المطلوب (${amount} ج.م) يتجاوز الرصيد المتاح حالياً للسحب (${availableBalance} ج.م)`);
  }

  const withdrawal = await Withdrawal.create({
    teacherId: new Types.ObjectId(userId) as any,
    amount: Number(amount),
    method: method || 'Vodafone Cash',
    accountDetails: accountDetails.trim(),
    status: 'Pending',
    requestedAt: new Date(),
  });

  await logActivity(userId, userName, userRole, 'PAYOUT_REQUESTED', {
    withdrawalId: withdrawal._id,
    amount,
    method,
  });

  res.status(201).json(new ApiResponse(201, withdrawal, 'تم تقديم طلب سحب الرصيد بنجاح وفي انتظار مراجعة الإدارة 🎉'));
});

/**
 * GET /teacher/earnings/revenue
 */
export const getTeacherRevenueBreakdown = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole);

  const monthlyRevenue = await Payment.aggregate([
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

  res.status(200).json(new ApiResponse(200, mappedMonthly, 'Revenue breakdown retrieved successfully'));
});

/**
 * GET /teacher/earnings/reports
 */
export const getTeacherFinancialReports = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole);

  const paidAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const grossRevenue = paidAgg[0]?.total || 0;
  const netRevenue = Math.round(grossRevenue * 0.85);

  const refundedAgg = await Payment.aggregate([
    { $match: { courseId: { $in: teacherCourseIds }, status: 'Refunded' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const refundedAmount = refundedAgg[0]?.total || 0;

  if (req.query.export === 'true') {
    await logActivity(userId, userName, userRole, 'FINANCIAL_REPORT_EXPORTED', { format: req.query.format || 'CSV' });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        grossRevenue,
        netRevenue,
        platformFee: grossRevenue - netRevenue,
        refundedAmount,
        paidTransactionsCount: paidAgg[0]?.count || 0,
        refundedTransactionsCount: refundedAgg[0]?.count || 0,
        generatedAt: new Date(),
      },
      'Financial report generated successfully'
    )
  );
});

/**
 * GET /teacher/earnings/refunds
 */
export const getTeacherRefunds = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const teacherCourseIds = await getTeacherCourseIds(userId, userRole);

  const refunds = await Payment.find({
    courseId: { $in: teacherCourseIds },
    status: 'Refunded',
  })
    .populate('studentId', 'firstName lastName email')
    .populate('courseId', 'title')
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, refunds, 'Refunds retrieved successfully'));
});
