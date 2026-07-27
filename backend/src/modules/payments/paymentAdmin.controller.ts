import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Payment } from './payment.model';
import { Withdrawal } from './withdrawal.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Course } from '../courses/course.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get all payments with summary metrics, filters, search, and pagination.
 */
export const getAllPaymentsAdmin = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    method,
    sort = 'newest',
  } = req.query;

  const filter: any = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  if (method && method !== 'All') {
    filter.paymentMethod = method;
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { paymentReference: searchRegex },
      ...(Types.ObjectId.isValid(search as string) ? [{ _id: new Types.ObjectId(search as string) }] : []),
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'highest_amount') sortOption = { amount: -1 };

  const rawPayments = await Payment.find(filter)
    .populate('studentId', 'firstName lastName email avatar phone')
    .populate({
      path: 'courseId',
      select: 'title price teacher',
      populate: { path: 'teacher', select: 'firstName lastName email avatar' },
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Payment.countDocuments(filter);

  // Summary Cards Data
  const totalRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = totalRevAgg[0]?.total || 0;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid', createdAt: { $gte: startOfDay } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const todayRevenue = todayRevAgg[0]?.total || 0;

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid', createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const monthlyRevenue = monthRevAgg[0]?.total || 0;

  const pendingPaymentsCount = await Payment.countDocuments({ status: 'Pending' });
  const approvedPaymentsCount = await Payment.countDocuments({ status: 'Paid' });
  const refundedPaymentsCount = await Payment.countDocuments({ status: 'Refunded' });
  const failedPaymentsCount = await Payment.countDocuments({ status: 'Failed' });

  const pendingWithdrawalsCount = await Withdrawal.countDocuments({ status: 'Pending' });
  const completedWithdrawalsCount = await Withdrawal.countDocuments({ status: 'Paid' });

  // Enrich payments payload
  const paymentsList = rawPayments.map((p) => {
    const studentObj: any = p.studentId || {};
    const courseObj: any = p.courseId || {};
    const teacherObj: any = courseObj.teacher || {};

    const studentName = `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() || studentObj.email || 'طالب غير محدد';
    const teacherName = `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email || 'معلم غير محدد';

    return {
      _id: p._id,
      paymentReference: p.paymentReference,
      amount: p.amount,
      currency: p.currency || 'EGP',
      paymentMethod: p.paymentMethod || 'Fawry / InstaPay',
      status: p.status,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
      student: {
        _id: studentObj._id,
        fullName: studentName,
        email: studentObj.email,
        phone: studentObj.phone,
        avatar: studentObj.avatar,
      },
      course: {
        _id: courseObj._id,
        title: courseObj.title || 'دورة تعليمية',
        price: courseObj.price || p.amount,
      },
      teacher: {
        _id: teacherObj._id,
        fullName: teacherName,
        email: teacherObj.email,
      },
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalRevenue,
          todayRevenue,
          monthlyRevenue,
          pendingPaymentsCount,
          approvedPaymentsCount,
          refundedPaymentsCount,
          failedPaymentsCount,
          pendingWithdrawalsCount,
          completedWithdrawalsCount,
        },
        payments: paymentsList,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Payments retrieved successfully'
    )
  );
});

/**
 * Get payment by ID.
 */
export const getPaymentByIdAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await Payment.findById(id)
    .populate('studentId', 'firstName lastName email avatar phone')
    .populate({
      path: 'courseId',
      select: 'title price teacher',
      populate: { path: 'teacher', select: 'firstName lastName email avatar phone' },
    });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  res.status(200).json(new ApiResponse(200, payment, 'Payment details retrieved successfully'));
});

/**
 * Approve payment and activate student enrollment.
 */
export const approvePaymentAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await Payment.findById(id);
  if (!payment) throw new ApiError(404, 'Payment transaction not found');

  payment.status = 'Paid';
  payment.paidAt = new Date();
  await payment.save();

  // Activate / Create Enrollment for Student
  if (payment.studentId && payment.courseId) {
    const existingEnrollment = await Enrollment.findOne({
      studentId: payment.studentId,
      courseId: payment.courseId,
    });

    if (existingEnrollment) {
      existingEnrollment.status = 'Active';
      existingEnrollment.paymentStatus = 'Paid';
      await existingEnrollment.save();
    } else {
      const course = await Course.findById(payment.courseId);
      await Enrollment.create({
        studentId: payment.studentId,
        courseId: payment.courseId,
        teacherId: course?.teacher || payment.studentId,
        status: 'Active',
        paymentStatus: 'Paid',
        purchasePrice: payment.amount,
        enrolledAt: new Date(),
        certificateIssued: false,
      });
    }

    // Send Notification to student
    await Notification.create({
      recipientId: payment.studentId,
      title: 'تم تأكيد عملية السداد بنجاح 🎉',
      message: `تم تأكيد سداد مبلغ ${payment.amount} ج.م وتفعيل اشتراكك بالدورة التعليمية.`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
    emitToUser(payment.studentId, 'notification', { type: 'payment_approved', paymentId: payment._id });
  }

  res.status(200).json(new ApiResponse(200, payment, 'تم تأكيد السداد وتفعيل اشتراك الطالب بنجاح'));
});

/**
 * Reject payment.
 */
export const rejectPaymentAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  if (!reason) throw new ApiError(400, 'سبب عدم قبول عملية السداد إلزامي');

  const payment = await Payment.findById(id);
  if (!payment) throw new ApiError(404, 'Payment transaction not found');

  payment.status = 'Failed';
  await payment.save();

  if (payment.studentId) {
    await Notification.create({
      recipientId: payment.studentId,
      title: 'تنبيه: عدم قبول عملية السداد ⚠️',
      message: `تعذر قبول عملية السداد الخاصة برقم المرجع ${payment.paymentReference}. السبب: ${reason}`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
  }

  res.status(200).json(new ApiResponse(200, null, 'تم تسجيل عدم قبول السداد وتنبيه الطالب'));
});

/**
 * Refund payment.
 */
export const refundPaymentAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  if (!reason) throw new ApiError(400, 'سبب الاسترجاع المالي إلزامي');

  const payment = await Payment.findById(id);
  if (!payment) throw new ApiError(404, 'Payment transaction not found');

  payment.status = 'Refunded';
  await payment.save();

  // Cancel Enrollment
  if (payment.studentId && payment.courseId) {
    const enrollment = await Enrollment.findOne({
      studentId: payment.studentId,
      courseId: payment.courseId,
    });
    if (enrollment) {
      enrollment.status = 'Cancelled';
      await enrollment.save();
    }

    await Notification.create({
      recipientId: payment.studentId,
      title: 'إشعار استرجاع مالي (Refund) 💸',
      message: `تم تنفيذ طلب الاسترجاع المالي بمبلغ ${payment.amount} ج.م. السبب: ${reason}`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
  }

  res.status(200).json(new ApiResponse(200, payment, 'تم استرجاع المبلغ المالي وتجميد الاشتراك بنجاح'));
});

/**
 * Get all withdrawal requests for Super Admin.
 */
export const getAllWithdrawalsAdmin = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status = 'All' } = req.query;

  const filter: any = {};
  if (status && status !== 'All') {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const rawWithdrawals = await Withdrawal.find(filter)
    .populate('teacherId', 'firstName lastName email avatar phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Withdrawal.countDocuments(filter);

  const withdrawals = rawWithdrawals.map((w) => {
    const teacherObj: any = w.teacherId || {};
    return {
      _id: w._id,
      amount: w.amount,
      method: w.method,
      accountDetails: w.accountDetails,
      status: w.status,
      requestedAt: w.requestedAt || w.createdAt,
      processedAt: w.processedAt,
      rejectionReason: w.rejectionReason,
      teacher: {
        _id: teacherObj._id,
        fullName: `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email,
        email: teacherObj.email,
        phone: teacherObj.phone,
        avatar: teacherObj.avatar,
      },
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        withdrawals,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Withdrawal requests retrieved successfully'
    )
  );
});

/**
 * Approve withdrawal request.
 */
export const approveWithdrawalAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) throw new ApiError(404, 'Withdrawal request not found');

  withdrawal.status = 'Approved';
  withdrawal.reviewedBy = (req as any).user?._id;
  await withdrawal.save();

  if (withdrawal.teacherId) {
    await Notification.create({
      recipientId: withdrawal.teacherId,
      title: 'تمت الموافقة على طلب سحب المستحقات 🟢',
      message: `تم اعتماد طلب سحب مبلغ ${withdrawal.amount} ج.م وهو قيد التحويل البنكي الآن.`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
  }

  res.status(200).json(new ApiResponse(200, withdrawal, 'تمت الموافقة على طلب السحب بنجاح'));
});

/**
 * Mark withdrawal request as Paid.
 */
export const markWithdrawalPaidAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) throw new ApiError(404, 'Withdrawal request not found');

  withdrawal.status = 'Paid';
  withdrawal.processedAt = new Date();
  await withdrawal.save();

  if (withdrawal.teacherId) {
    await Notification.create({
      recipientId: withdrawal.teacherId,
      title: 'تم تحويل مستحقاتك المالية بنجاح 💸',
      message: `تم تحويل مبلغ ${withdrawal.amount} ج.m بنجاح إلى حسابك (${withdrawal.method} - ${withdrawal.accountDetails}).`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
    emitToUser(withdrawal.teacherId, 'notification', { type: 'withdrawal_paid', amount: withdrawal.amount });
  }

  res.status(200).json(new ApiResponse(200, withdrawal, 'تم تأكيد تحويل الأرباح للمحاضر بنجاح'));
});

/**
 * Reject withdrawal request with reason.
 */
export const rejectWithdrawalAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  if (!reason) throw new ApiError(400, 'سبب رفض طلب السحب إلزامي');

  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) throw new ApiError(404, 'Withdrawal request not found');

  withdrawal.status = 'Rejected';
  withdrawal.rejectionReason = reason;
  await withdrawal.save();

  if (withdrawal.teacherId) {
    await Notification.create({
      recipientId: withdrawal.teacherId,
      title: 'تنبيه: عدم قبول طلب السحب ⚠️',
      message: `تعذر تنفيذ طلب سحب مبلغ ${withdrawal.amount} ج.م. السبب: ${reason}`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
  }

  res.status(200).json(new ApiResponse(200, null, 'تم تسجيل رفض طلب السحب بنجاح'));
});

/**
 * Financial revenue analytics.
 */
export const getRevenueAnalyticsAdmin = catchAsync(async (_req: Request, res: Response) => {
  const totalRevAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const methodsAgg = await Payment.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue: totalRevAgg[0]?.total || 0,
        methodsDistribution: methodsAgg,
      },
      'Revenue analytics retrieved successfully'
    )
  );
});
