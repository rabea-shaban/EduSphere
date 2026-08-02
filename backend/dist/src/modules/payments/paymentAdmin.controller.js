"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueAnalyticsAdmin = exports.rejectWithdrawalAdmin = exports.markWithdrawalPaidAdmin = exports.approveWithdrawalAdmin = exports.getAllWithdrawalsAdmin = exports.refundPaymentAdmin = exports.rejectPaymentAdmin = exports.approvePaymentAdmin = exports.getPaymentByIdAdmin = exports.getAllPaymentsAdmin = void 0;
const mongoose_1 = require("mongoose");
const payment_model_1 = require("./payment.model");
const withdrawal_model_1 = require("./withdrawal.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const course_model_1 = require("../courses/course.model");
const notification_model_1 = require("../notifications/notification.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get all payments with summary metrics, filters, search, and pagination.
 */
exports.getAllPaymentsAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, status, method, sort = 'newest', } = req.query;
    const filter = {};
    if (status && status !== 'All')
        filter.status = status;
    if (method && method !== 'All')
        filter.paymentMethod = method;
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { paymentReference: searchRegex },
            ...(mongoose_1.Types.ObjectId.isValid(search) ? [{ _id: new mongoose_1.Types.ObjectId(search) }] : []),
        ];
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest')
        sortOption = { createdAt: 1 };
    if (sort === 'newest')
        sortOption = { createdAt: -1 };
    const rawPayments = await payment_model_1.Payment.find(filter)
        .populate('studentId', 'firstName lastName email avatar phone')
        .populate({
        path: 'courseId',
        select: 'title price teacher',
        populate: { path: 'teacher', select: 'firstName lastName email avatar' },
    })
        .sort(sortOption);
    const rawEnrollments = await enrollment_model_1.Enrollment.find({ paymentStatus: 'Paid' })
        .populate('studentId', 'firstName lastName email avatar phone')
        .populate({
        path: 'courseId',
        select: 'title price teacher',
        populate: { path: 'teacher', select: 'firstName lastName email avatar' },
    })
        .populate('teacherId', 'firstName lastName email avatar')
        .sort({ createdAt: -1 });
    // Map Payments
    const paymentItems = rawPayments.map((p) => {
        const studentObj = p.studentId || {};
        const courseObj = p.courseId || {};
        const teacherObj = courseObj.teacher || {};
        const studentName = `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() || studentObj.email || 'طالب غير محدد';
        const teacherName = `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email || 'معلم غير محدد';
        return {
            _id: p._id,
            paymentReference: p.paymentReference,
            amount: p.amount,
            currency: p.currency || 'EGP',
            paymentMethod: p.paymentMethod || 'Vodafone Cash / InstaPay',
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
    // Map Enrollments
    const enrollmentItems = rawEnrollments.map((e) => {
        const studentObj = e.studentId || {};
        const courseObj = e.courseId || {};
        const teacherObj = e.teacherId || courseObj.teacher || {};
        const studentName = `${studentObj.firstName || ''} ${studentObj.lastName || ''}`.trim() || studentObj.email || 'طالب غير محدد';
        const teacherName = `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email || 'معلم غير محدد';
        const ref = `ENR-${(e._id?.toString() || '').substring(18).toUpperCase()}`;
        return {
            _id: e._id,
            paymentReference: ref,
            amount: e.purchasePrice || courseObj.price || 450,
            currency: 'EGP',
            paymentMethod: 'Vodafone Cash / InstaPay',
            status: e.status === 'Cancelled' ? 'Failed' : 'Paid',
            paidAt: e.enrolledAt || e.createdAt,
            createdAt: e.createdAt,
            student: {
                _id: studentObj._id,
                fullName: studentName,
                email: studentObj.email,
                phone: studentObj.phone,
                avatar: studentObj.avatar,
            },
            course: {
                _id: courseObj._id,
                title: courseObj.title || 'أساسيات البرمجة وتطوير الويب',
                price: courseObj.price || e.purchasePrice || 450,
            },
            teacher: {
                _id: teacherObj._id,
                fullName: teacherName,
                email: teacherObj.email,
            },
        };
    });
    // Combine list without duplicates
    const combinedPaymentsMap = new Map();
    paymentItems.forEach((item) => combinedPaymentsMap.set(item._id.toString(), item));
    enrollmentItems.forEach((item) => {
        if (!combinedPaymentsMap.has(item._id.toString())) {
            combinedPaymentsMap.set(item._id.toString(), item);
        }
    });
    let allCombinedList = Array.from(combinedPaymentsMap.values());
    // Apply status filter if provided
    if (status && status !== 'All') {
        allCombinedList = allCombinedList.filter((item) => item.status === status);
    }
    // Apply search filter if provided
    if (search) {
        const s = search.toLowerCase();
        allCombinedList = allCombinedList.filter((item) => item.paymentReference.toLowerCase().includes(s) ||
            item.student.fullName.toLowerCase().includes(s) ||
            item.student.email?.toLowerCase().includes(s) ||
            item.course.title.toLowerCase().includes(s));
    }
    const total = allCombinedList.length;
    const paginatedList = allCombinedList.slice(skip, skip + limitNum);
    // Summary Card Calculations
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [payAgg, enrollAgg, payToday, enrollToday, payMonth, enrollMonth] = await Promise.all([
        payment_model_1.Payment.aggregate([{ $match: { status: 'Paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        enrollment_model_1.Enrollment.aggregate([{ $match: { paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$purchasePrice' } } }]),
        payment_model_1.Payment.aggregate([{ $match: { status: 'Paid', createdAt: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        enrollment_model_1.Enrollment.aggregate([{ $match: { paymentStatus: 'Paid', createdAt: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$purchasePrice' } } }]),
        payment_model_1.Payment.aggregate([{ $match: { status: 'Paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        enrollment_model_1.Enrollment.aggregate([{ $match: { paymentStatus: 'Paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$purchasePrice' } } }]),
    ]);
    const grossFromPayments = payAgg[0]?.total || 0;
    const grossFromEnrollments = enrollAgg[0]?.total || 0;
    const totalRevenue = Math.max(grossFromPayments, grossFromEnrollments) || (grossFromPayments + grossFromEnrollments);
    const todayRevenue = Math.max(payToday[0]?.total || 0, enrollToday[0]?.total || 0);
    const monthlyRevenue = Math.max(payMonth[0]?.total || 0, enrollMonth[0]?.total || 0);
    const pendingPaymentsCount = await payment_model_1.Payment.countDocuments({ status: 'Pending' });
    const approvedPaymentsCount = Math.max(await payment_model_1.Payment.countDocuments({ status: 'Paid' }), rawEnrollments.length);
    const refundedPaymentsCount = await payment_model_1.Payment.countDocuments({ status: 'Refunded' });
    const failedPaymentsCount = await payment_model_1.Payment.countDocuments({ status: 'Failed' });
    const pendingWithdrawalsCount = await withdrawal_model_1.Withdrawal.countDocuments({ status: 'Pending' });
    const completedWithdrawalsCount = await withdrawal_model_1.Withdrawal.countDocuments({ status: 'Paid' });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
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
        payments: paginatedList,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum) || 1,
        },
    }, 'Payments retrieved successfully'));
});
/**
 * Get payment by ID.
 */
exports.getPaymentByIdAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payment = await payment_model_1.Payment.findById(id)
        .populate('studentId', 'firstName lastName email avatar phone')
        .populate({
        path: 'courseId',
        select: 'title price teacher',
        populate: { path: 'teacher', select: 'firstName lastName email avatar phone' },
    });
    if (!payment) {
        throw new ApiError_1.ApiError(404, 'Payment not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'Payment details retrieved successfully'));
});
/**
 * Approve payment and activate student enrollment.
 */
exports.approvePaymentAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payment = await payment_model_1.Payment.findById(id);
    if (!payment)
        throw new ApiError_1.ApiError(404, 'Payment transaction not found');
    payment.status = 'Paid';
    payment.paidAt = new Date();
    await payment.save();
    // Activate / Create Enrollment for Student
    if (payment.studentId && payment.courseId) {
        const existingEnrollment = await enrollment_model_1.Enrollment.findOne({
            studentId: payment.studentId,
            courseId: payment.courseId,
        });
        if (existingEnrollment) {
            existingEnrollment.status = 'Active';
            existingEnrollment.paymentStatus = 'Paid';
            await existingEnrollment.save();
        }
        else {
            const course = await course_model_1.Course.findById(payment.courseId);
            await enrollment_model_1.Enrollment.create({
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
        await notification_model_1.Notification.create({
            recipientId: payment.studentId,
            title: 'تم تأكيد عملية السداد بنجاح 🎉',
            message: `تم تأكيد سداد مبلغ ${payment.amount} ج.م وتفعيل اشتراكك بالدورة التعليمية.`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
        (0, socket_1.emitToUser)(payment.studentId, 'notification', { type: 'payment_approved', paymentId: payment._id });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'تم تأكيد السداد وتفعيل اشتراك الطالب بنجاح'));
});
/**
 * Reject payment.
 */
exports.rejectPaymentAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason)
        throw new ApiError_1.ApiError(400, 'سبب عدم قبول عملية السداد إلزامي');
    const payment = await payment_model_1.Payment.findById(id);
    if (!payment)
        throw new ApiError_1.ApiError(404, 'Payment transaction not found');
    payment.status = 'Failed';
    await payment.save();
    if (payment.studentId) {
        await notification_model_1.Notification.create({
            recipientId: payment.studentId,
            title: 'تنبيه: عدم قبول عملية السداد ⚠️',
            message: `تعذر قبول عملية السداد الخاصة برقم المرجع ${payment.paymentReference}. السبب: ${reason}`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تسجيل عدم قبول السداد وتنبيه الطالب'));
});
/**
 * Refund payment.
 */
exports.refundPaymentAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason)
        throw new ApiError_1.ApiError(400, 'سبب الاسترجاع المالي إلزامي');
    const payment = await payment_model_1.Payment.findById(id);
    if (!payment)
        throw new ApiError_1.ApiError(404, 'Payment transaction not found');
    payment.status = 'Refunded';
    await payment.save();
    // Cancel Enrollment
    if (payment.studentId && payment.courseId) {
        const enrollment = await enrollment_model_1.Enrollment.findOne({
            studentId: payment.studentId,
            courseId: payment.courseId,
        });
        if (enrollment) {
            enrollment.status = 'Cancelled';
            await enrollment.save();
        }
        await notification_model_1.Notification.create({
            recipientId: payment.studentId,
            title: 'إشعار استرجاع مالي (Refund) 💸',
            message: `تم تنفيذ طلب الاسترجاع المالي بمبلغ ${payment.amount} ج.م. السبب: ${reason}`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'تم استرجاع المبلغ المالي وتجميد الاشتراك بنجاح'));
});
/**
 * Get all withdrawal requests for Super Admin.
 */
exports.getAllWithdrawalsAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, status = 'All' } = req.query;
    const filter = {};
    if (status && status !== 'All') {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const rawWithdrawals = await withdrawal_model_1.Withdrawal.find(filter)
        .populate('teacherId', 'firstName lastName email avatar phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await withdrawal_model_1.Withdrawal.countDocuments(filter);
    const withdrawals = rawWithdrawals.map((w) => {
        const teacherObj = w.teacherId || {};
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        withdrawals,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Withdrawal requests retrieved successfully'));
});
/**
 * Approve withdrawal request.
 */
exports.approveWithdrawalAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const withdrawal = await withdrawal_model_1.Withdrawal.findById(id);
    if (!withdrawal)
        throw new ApiError_1.ApiError(404, 'Withdrawal request not found');
    withdrawal.status = 'Approved';
    withdrawal.reviewedBy = req.user?._id;
    await withdrawal.save();
    if (withdrawal.teacherId) {
        await notification_model_1.Notification.create({
            recipientId: withdrawal.teacherId,
            title: 'تمت الموافقة على طلب سحب المستحقات 🟢',
            message: `تم اعتماد طلب سحب مبلغ ${withdrawal.amount} ج.م وهو قيد التحويل البنكي الآن.`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, withdrawal, 'تمت الموافقة على طلب السحب بنجاح'));
});
/**
 * Mark withdrawal request as Paid.
 */
exports.markWithdrawalPaidAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const withdrawal = await withdrawal_model_1.Withdrawal.findById(id);
    if (!withdrawal)
        throw new ApiError_1.ApiError(404, 'Withdrawal request not found');
    withdrawal.status = 'Paid';
    withdrawal.processedAt = new Date();
    await withdrawal.save();
    if (withdrawal.teacherId) {
        await notification_model_1.Notification.create({
            recipientId: withdrawal.teacherId,
            title: 'تم تحويل مستحقاتك المالية بنجاح 💸',
            message: `تم تحويل مبلغ ${withdrawal.amount} ج.m بنجاح إلى حسابك (${withdrawal.method} - ${withdrawal.accountDetails}).`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
        (0, socket_1.emitToUser)(withdrawal.teacherId, 'notification', { type: 'withdrawal_paid', amount: withdrawal.amount });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, withdrawal, 'تم تأكيد تحويل الأرباح للمحاضر بنجاح'));
});
/**
 * Reject withdrawal request with reason.
 */
exports.rejectWithdrawalAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason)
        throw new ApiError_1.ApiError(400, 'سبب رفض طلب السحب إلزامي');
    const withdrawal = await withdrawal_model_1.Withdrawal.findById(id);
    if (!withdrawal)
        throw new ApiError_1.ApiError(404, 'Withdrawal request not found');
    withdrawal.status = 'Rejected';
    withdrawal.rejectionReason = reason;
    await withdrawal.save();
    if (withdrawal.teacherId) {
        await notification_model_1.Notification.create({
            recipientId: withdrawal.teacherId,
            title: 'تنبيه: عدم قبول طلب السحب ⚠️',
            message: `تعذر تنفيذ طلب سحب مبلغ ${withdrawal.amount} ج.م. السبب: ${reason}`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تسجيل رفض طلب السحب بنجاح'));
});
/**
 * Financial revenue analytics.
 */
exports.getRevenueAnalyticsAdmin = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const totalRevAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const methodsAgg = await payment_model_1.Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalRevenue: totalRevAgg[0]?.total || 0,
        methodsDistribution: methodsAgg,
    }, 'Revenue analytics retrieved successfully'));
});
