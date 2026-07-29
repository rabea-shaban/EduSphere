import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { TeacherApplication } from './teacherApplication.model';
import { User } from '../users/user.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Submit a new teacher application.
 */
export const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { email } = req.body;

  // Check if an application already exists for this user/email with Pending or UnderReview status
  const existingApp = await TeacherApplication.findOne({
    $or: [
      ...(userId ? [{ userId }] : []),
      { email: email.toLowerCase() },
    ],
    status: { $in: ['Pending', 'UnderReview'] },
  });

  if (existingApp) {
    throw new ApiError(400, 'يوجد طلب انضمام قيد المراجعة بالفعل لهذا البريد الإلكتروني');
  }

  const applicationData = {
    ...req.body,
    email: email.toLowerCase(),
    userId: userId || req.body.userId || undefined, // JWT takes priority, body as fallback for linked accounts
    status: 'Pending',
  };

  const application = await TeacherApplication.create(applicationData);
  res.status(201).json(new ApiResponse(201, application, 'تم استلام طلب الانضمام كمعلم بنجاح'));
});

/**
 * Get current user's teacher application status.
 */
export const getMyApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userEmail = req.user?.email;

  if (!userId && !userEmail) {
    throw new ApiError(401, 'Unauthorized');
  }

  const application = await TeacherApplication.findOne({
    $or: [
      ...(userId ? [{ userId }] : []),
      ...(userEmail ? [{ email: userEmail.toLowerCase() }] : []),
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, application || null, 'Application status retrieved successfully'));
});

/**
 * Public status lookup by email or national ID.
 */
export const checkStatusByQuery = catchAsync(async (req: Request, res: Response) => {
  const rawQuery = (req.body?.query || req.query?.query) as string;
  if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
    throw new ApiError(400, 'يرجى إدخال البريد الإلكتروني أو الرقم القومي للاستعلام');
  }

  const cleanQuery = rawQuery.trim().toLowerCase();

  const application = await TeacherApplication.findOne({
    $or: [
      { email: cleanQuery },
      { nationalId: cleanQuery },
      { phone: cleanQuery },
    ],
  }).sort({ createdAt: -1 });

  if (!application) {
    throw new ApiError(404, 'لم يتم العثور على أي طلب انضمام مسجل بهذا البريد الإلكتروني أو الرقم القومي أو الهاتف');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: application._id,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        nationalId: application.nationalId,
        subject: application.subject,
        stage: application.stage,
        experienceYears: application.experienceYears,
        status: application.status,
        rejectionReason: application.rejectionReason,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
      'تم العثور على حالة الطلب بنجاح'
    )
  );
});

/**
 * List all teacher applications (Admins only).
 */
export const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, search, stage, subject, experienceYears, startDate, endDate } = req.query;
  const filter: any = {};

  if (status && status !== 'All') {
    filter.status = status;
  }
  if (stage && stage !== 'All') {
    filter.stage = new RegExp(stage as string, 'i');
  }
  if (subject && subject !== 'All') {
    filter.subject = new RegExp(subject as string, 'i');
  }
  if (experienceYears && !isNaN(Number(experienceYears))) {
    filter.experienceYears = { $gte: Number(experienceYears) };
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { nationalId: searchRegex },
      { subject: searchRegex },
      ...(Types.ObjectId.isValid(search as string) ? [{ _id: new Types.ObjectId(search as string) }] : []),
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const applications = await TeacherApplication.find(filter)
    .populate('userId', 'firstName lastName email avatar')
    .populate('reviewedBy', 'firstName lastName email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await TeacherApplication.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        applications,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      },
      'Teacher applications retrieved successfully'
    )
  );
});

/**
 * Get single teacher application details (Admins only).
 */
export const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const application = await TeacherApplication.findById(id)
    .populate('userId', 'firstName lastName email avatar phone')
    .populate('reviewedBy', 'firstName lastName email avatar');

  if (!application) throw new ApiError(404, 'Teacher application not found');
  res.status(200).json(new ApiResponse(200, application, 'Application details retrieved successfully'));
});

/**
 * Approve or Reject teacher application (Admins only).
 */
export const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  const adminId = req.user?._id;

  const application = await TeacherApplication.findById(id);
  if (!application) throw new ApiError(404, 'Teacher application not found');

  application.status = status;
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();

  if (status === 'Rejected') {
    application.rejectionReason = rejectionReason || 'لم يتم استيفاء كافة الشروط المطلوبة';
  }

  await application.save();

  // Find corresponding User to update role and send notification
  const user = await User.findOne({
    $or: [
      ...(application.userId ? [{ _id: application.userId }] : []),
      { email: application.email.toLowerCase() },
    ],
  });

  if (user) {
    if (status === 'Approved') {
      user.role = 'TEACHER';
      await user.save();

      // Create Notification
      const notif = await Notification.create({
        recipientId: user._id,
        title: 'تهانينا! تم قبول طلب انضمامك كمعلم 🎉',
        message: `أهلاً بك أستاذ ${application.fullName} في فريق معلمين EduSphere. يمكنك الآن الدخول إلى لوحة تحكم المعلم وبدء إنشاء الكورسات.`,
        type: 'System',
        priority: 'High',
        deliveryChannel: ['InApp'],
        isRead: false,
      });
      emitToUser(user._id, 'notification', notif);
    } else if (status === 'Rejected') {
      const notif = await Notification.create({
        recipientId: user._id,
        title: 'تحديث بشأن طلب انضمامك كمعلم',
        message: `تم مراجعة طلب انضمامك. ${rejectionReason ? `السبب: ${rejectionReason}` : 'لم يتم استيفاء جميع الشروط.'}`,
        type: 'System',
        priority: 'Medium',
        deliveryChannel: ['InApp'],
        isRead: false,
      });
      emitToUser(user._id, 'notification', notif);
    }
  }

  res.status(200).json(new ApiResponse(200, application, `تم تحديث حالة الطلب إلى ${status} بنجاح`));
});

/**
 * Delete a teacher application (Admins only).
 */
export const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const application = await TeacherApplication.findByIdAndDelete(id);
  if (!application) throw new ApiError(404, 'Teacher application not found');

  res.status(200).json(new ApiResponse(200, null, 'Application deleted successfully'));
});

/**
 * Bulk approve teacher applications (Admins only).
 */
export const bulkApproveApplications = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'يرجى تحديد طلب واحد على الأقل للاعتماد الجماعي');
  }

  const adminId = req.user?._id;

  const applications = await TeacherApplication.find({ _id: { $in: ids } });
  for (const app of applications) {
    app.status = 'Approved';
    app.reviewedBy = adminId;
    app.reviewedAt = new Date();
    await app.save();

    // Convert User role
    const user = await User.findOne({
      $or: [
        ...(app.userId ? [{ _id: app.userId }] : []),
        { email: app.email.toLowerCase() },
      ],
    });
    if (user) {
      user.role = 'TEACHER';
      await user.save();
    }
  }

  res.status(200).json(new ApiResponse(200, { approvedCount: applications.length }, 'تم اعتماد الطلبات المحددة بنجاح'));
});

/**
 * Bulk reject teacher applications (Admins only).
 */
export const bulkRejectApplications = catchAsync(async (req: Request, res: Response) => {
  const { ids, rejectionReason } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'يرجى تحديد طلب واحد على الأقل للرفض الجماعي');
  }

  const adminId = req.user?._id;

  const result = await TeacherApplication.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        status: 'Rejected',
        rejectionReason: rejectionReason || 'لم يتم استيفاء المستندات أو الشروط المطلوبة',
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    }
  );

  res.status(200).json(new ApiResponse(200, { rejectedCount: result.modifiedCount }, 'تم رفض الطلبات المحددة بنجاح'));
});
