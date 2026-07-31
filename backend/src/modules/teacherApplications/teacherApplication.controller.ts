import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { TeacherApplication } from './teacherApplication.model';
import { TeacherProfile } from '../teachers/teacherProfile.model';
import { User } from '../users/user.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// ─── Helper: find application by userId OR email ──────────────────────────────
async function findMyApplication(userId?: Types.ObjectId, userEmail?: string) {
  return TeacherApplication.findOne({
    $or: [
      ...(userId ? [{ userId }] : []),
      ...(userEmail ? [{ email: userEmail.toLowerCase() }] : []),
    ],
  }).sort({ createdAt: -1 });
}

// ─── Helper: notify user ──────────────────────────────────────────────────────
async function notifyUser(recipientId: Types.ObjectId, title: string, message: string, priority: 'High' | 'Medium' | 'Low' = 'High') {
  try {
    const notif = await Notification.create({
      recipientId,
      title,
      message,
      type: 'System',
      priority,
      deliveryChannel: ['InApp'],
      isRead: false,
    });
    emitToUser(recipientId, 'notification', notif);
  } catch {
    // Non-critical — don't block response
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER-FACING ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /teacher/apply
 * Submit a full application OR save a draft.
 * Body: { isDraft?: boolean, ...fields }
 */
export const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userEmail = req.user?.email;
  const { isDraft = false, email } = req.body;

  const effectiveEmail = (email || userEmail || '').toLowerCase().trim();

  // Check for any active non-draft application
  const existingApp = await TeacherApplication.findOne({
    $or: [
      ...(userId ? [{ userId }] : []),
      ...(effectiveEmail ? [{ email: effectiveEmail }] : []),
    ],
    status: { $in: ['Submitted', 'Pending', 'UnderReview', 'Approved', 'NeedsChanges'] },
    isDraft: false,
  });

  if (existingApp && !isDraft) {
    throw new ApiError(400, 'يوجد طلب انضمام نشط بالفعل لهذا الحساب. يمكنك الاستعلام عن حالة طلبك.');
  }

  // Remove any old drafts for this user before saving a new one
  if (isDraft && userId) {
    await TeacherApplication.deleteMany({ userId, isDraft: true });
  }

  let targetUserId = userId;

  // Auto-find or auto-create User record for guest submissions
  if (!targetUserId && effectiveEmail) {
    let existingUser = await User.findOne({
      $or: [
        { email: effectiveEmail },
        ...(req.body.phone ? [{ phone: req.body.phone.trim() }] : []),
      ],
    });

    if (!existingUser) {
      try {
        const nameParts = (req.body.fullName || '').trim().split(' ');
        const firstName = nameParts[0] || 'متقدم';
        const lastName = nameParts.slice(1).join(' ') || 'جديد';
        const baseUsername = effectiveEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const username = `${baseUsername}_${randomNum}`.toLowerCase();
        const userPassword = req.body.password || 'EduSphere@2026';

        existingUser = await User.create({
          firstName,
          lastName,
          username,
          email: effectiveEmail,
          phone: req.body.phone || '',
          password: userPassword,
          role: 'STUDENT',
          isVerified: true,
        });
      } catch {
        // Continue if auto-create hits constraint
      }
    }

    if (existingUser) {
      targetUserId = existingUser._id;
    }
  }

  const applicationData = {
    ...req.body,
    email: effectiveEmail || req.body.email,
    userId: targetUserId || undefined,
    isDraft,
    status: isDraft ? 'Draft' : 'Pending',
    submittedAt: isDraft ? undefined : new Date(),
  };

  const application = await TeacherApplication.create(applicationData);

  const message = isDraft
    ? 'تم حفظ المسودة بنجاح. يمكنك مواصلة إكمال البيانات وتقديم الطلب لاحقاً.'
    : 'تم استلام طلب الانضمام كمعلم بنجاح. سيتم التواصل معك قريباً عبر البريد الإلكتروني.';

  res.status(201).json(new ApiResponse(201, application, message));
});

/**
 * GET /teacher/application
 * Get the current authenticated user's application.
 */
export const getMyApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userEmail = req.user?.email;

  const application = await findMyApplication(userId, userEmail);

  res.status(200).json(new ApiResponse(200, application || null, 'تم جلب بيانات طلبك بنجاح'));
});

/**
 * PUT /teacher/application
 * Update own application. Only allowed when Draft, NeedsChanges, or Rejected.
 */
export const updateMyApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userEmail = req.user?.email;

  const application = await findMyApplication(userId, userEmail);

  if (!application) {
    throw new ApiError(404, 'لا يوجد طلب انضمام مسجل. يرجى تقديم طلب جديد أولاً.');
  }

  const editableStatuses = ['Draft', 'Rejected', 'NeedsChanges'];
  if (!editableStatuses.includes(application.status)) {
    throw new ApiError(400, `لا يمكن تعديل الطلب في الحالة الحالية (${application.status}). الطلبات المعتمدة أو قيد المراجعة غير قابلة للتعديل.`);
  }

  const { isDraft, ...updateData } = req.body;
  const isSubmitting = isDraft === false;

  // If resubmitting from Rejected or NeedsChanges → reset to Pending
  const newStatus = isSubmitting
    ? 'Pending'
    : application.isDraft
    ? 'Draft'
    : application.status;

  Object.assign(application, {
    ...updateData,
    status: newStatus,
    isDraft: isSubmitting ? false : (isDraft ?? application.isDraft),
    submittedAt: isSubmitting ? new Date() : application.submittedAt,
    changesRequested: newStatus === 'Pending' ? undefined : application.changesRequested,
    rejectionReason: newStatus === 'Pending' ? undefined : application.rejectionReason,
  });

  await application.save();

  const message = isSubmitting
    ? 'تم إعادة إرسال الطلب المحدث للمراجعة بنجاح.'
    : 'تم حفظ التعديلات بنجاح.';

  res.status(200).json(new ApiResponse(200, application, message));
});

/**
 * DELETE /teacher/application
 * Delete own application. Only allowed when Draft status.
 */
export const deleteMyApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const userEmail = req.user?.email;

  const application = await findMyApplication(userId, userEmail);

  if (!application) {
    throw new ApiError(404, 'لا يوجد طلب انضمام مسجل.');
  }

  if (application.status !== 'Draft') {
    throw new ApiError(400, 'لا يمكن حذف الطلبات المُرسلة. يمكنك فقط حذف المسودات.');
  }

  await application.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'تم حذف المسودة بنجاح.'));
});

/**
 * POST /teacher/check-status  (public)
 * GET  /teacher/check-status  (public)
 */
export const checkStatusByQuery = catchAsync(async (req: Request, res: Response) => {
  const rawQuery = (req.body?.query || req.query?.query) as string;
  if (!rawQuery?.trim()) {
    throw new ApiError(400, 'يرجى إدخال البريد الإلكتروني أو الرقم القومي للاستعلام');
  }

  const cleanQuery = rawQuery.trim().toLowerCase();

  const application = await TeacherApplication.findOne({
    $or: [
      { email: cleanQuery },
      { nationalId: cleanQuery },
      { phone: cleanQuery },
    ],
    isDraft: false,
  }).sort({ createdAt: -1 });

  if (!application) {
    throw new ApiError(404, 'لم يتم العثور على طلب انضمام مسجل بهذه البيانات');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: application._id,
        fullName: application.fullName,
        email: application.email,
        subject: application.subject,
        stage: application.stage,
        status: application.status,
        isDraft: application.isDraft,
        rejectionReason: application.rejectionReason,
        changesRequested: application.changesRequested,
        submittedAt: application.submittedAt,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
      'تم العثور على حالة الطلب بنجاح'
    )
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/teacher-applications
 */
export const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
    search,
    stage,
    subject,
    experienceYears,
    startDate,
    endDate,
    isDraft,
  } = req.query;

  const filter: any = {};

  // By default, exclude drafts from admin list unless explicitly requested
  if (isDraft === 'true') {
    filter.isDraft = true;
  } else if (isDraft === 'false') {
    filter.isDraft = false;
  } else {
    filter.isDraft = { $ne: true };
  }

  if (status && status !== 'All') filter.status = status;
  if (stage && stage !== 'All') filter.stage = new RegExp(stage as string, 'i');
  if (subject && subject !== 'All') filter.subject = new RegExp(subject as string, 'i');
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
      ...(Types.ObjectId.isValid(search as string)
        ? [{ _id: new Types.ObjectId(search as string) }]
        : []),
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [applications, total] = await Promise.all([
    TeacherApplication.find(filter)
      .populate('userId', 'firstName lastName email avatar')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    TeacherApplication.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        applications,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Teacher applications retrieved successfully'
    )
  );
});

/**
 * GET /admin/teacher-applications/:id
 */
export const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const application = await TeacherApplication.findById(req.params.id)
    .populate('userId', 'firstName lastName email avatar phone')
    .populate('reviewedBy', 'firstName lastName email avatar');

  if (!application) throw new ApiError(404, 'طلب الانضمام غير موجود');

  res.status(200).json(new ApiResponse(200, application, 'تم جلب تفاصيل الطلب بنجاح'));
});

/**
 * PATCH /admin/teacher-applications/:id/approve
 */
export const approveApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?._id;

  const application = await TeacherApplication.findById(id);
  if (!application) throw new ApiError(404, 'طلب الانضمام غير موجود');

  if (application.status === 'Approved') {
    throw new ApiError(400, 'هذا الطلب مقبول بالفعل');
  }

  // Update application
  application.status = 'Approved';
  application.isDraft = false;
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  application.approvedAt = new Date();
  application.rejectionReason = undefined;
  application.changesRequested = undefined;
  await application.save();

  // Promote user to TEACHER role
  const user = await User.findOne({
    $or: [
      ...(application.userId ? [{ _id: application.userId }] : []),
      { email: application.email.toLowerCase() },
    ],
  });

  if (user) {
    user.role = 'TEACHER';
    await user.save();

    // Auto-create TeacherProfile if not exists
    const existingProfile = await TeacherProfile.findOne({ userId: user._id });
    if (!existingProfile) {
      await TeacherProfile.create({
        userId: user._id,
        displayName: application.fullName,
        headline: `${application.subject} | ${application.stage}`,
        bio: application.bio || '',
        professionalInfo: {
          yearsOfExperience: application.experienceYears,
          specialization: application.subject,
          skills: [],
          certifications: application.certificateDoc ? ['شهادة مرفوعة'] : [],
          education: [`${application.degree} — ${application.university} (${application.graduationYear})`],
          languages: ['العربية'],
        },
        socialLinks: {
          linkedIn: application.socialLinks?.linkedin || '',
          facebook: application.socialLinks?.facebook || '',
          youTube: application.socialLinks?.youtube || '',
          website: application.socialLinks?.website || '',
        },
        completionPercentage: 60,
        isPublic: true,
      });
    }

    // Notify user
    await notifyUser(
      user._id as Types.ObjectId,
      'تهانينا! تم قبول طلب انضمامك كمعلم في EduSphere',
      `أهلاً بك أستاذ ${application.fullName}. تم قبول طلبك وترقية حسابك لمعلم معتمد. يمكنك الآن الدخول للوحة تحكم المعلم وبدء إنشاء الكورسات.`,
      'High'
    );
  }

  res.status(200).json(new ApiResponse(200, application, 'تم قبول طلب المعلم وترقية حسابه بنجاح'));
});

/**
 * PATCH /admin/teacher-applications/:id/reject
 */
export const rejectApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?._id;
  const { rejectionReason } = req.body;

  if (!rejectionReason?.trim()) {
    throw new ApiError(400, 'يرجى تحديد سبب الرفض');
  }

  const application = await TeacherApplication.findById(id);
  if (!application) throw new ApiError(404, 'طلب الانضمام غير موجود');

  application.status = 'Rejected';
  application.rejectionReason = rejectionReason.trim();
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  application.changesRequested = undefined;
  await application.save();

  // Notify user
  const user = await User.findOne({
    $or: [
      ...(application.userId ? [{ _id: application.userId }] : []),
      { email: application.email.toLowerCase() },
    ],
  });

  if (user) {
    await notifyUser(
      user._id as Types.ObjectId,
      'تحديث بشأن طلب انضمامك كمعلم',
      `عزيزي ${application.fullName}، بعد مراجعة طلبك، لم نتمكن من القبول في هذا الوقت. السبب: ${rejectionReason}. يمكنك مراجعة البيانات وإعادة التقديم.`,
      'Medium'
    );
  }

  res.status(200).json(new ApiResponse(200, application, 'تم رفض الطلب وإبلاغ مقدمه'));
});

/**
 * PATCH /admin/teacher-applications/:id/request-changes
 */
export const requestChanges = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?._id;
  const { changesRequested } = req.body;

  if (!changesRequested?.trim()) {
    throw new ApiError(400, 'يرجى تحديد التعديلات المطلوبة');
  }

  const application = await TeacherApplication.findById(id);
  if (!application) throw new ApiError(404, 'طلب الانضمام غير موجود');

  application.status = 'NeedsChanges';
  application.changesRequested = changesRequested.trim();
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();
  await application.save();

  // Notify user
  const user = await User.findOne({
    $or: [
      ...(application.userId ? [{ _id: application.userId }] : []),
      { email: application.email.toLowerCase() },
    ],
  });

  if (user) {
    await notifyUser(
      user._id as Types.ObjectId,
      'طلبك يحتاج لبعض التعديلات',
      `عزيزي ${application.fullName}، راجع فريقنا طلبك ويطلب بعض التعديلات: ${changesRequested}. يرجى الدخول وتحديث الطلب.`,
      'High'
    );
  }

  res.status(200).json(new ApiResponse(200, application, 'تم إرسال طلب التعديلات للمتقدم'));
});

/**
 * PATCH /admin/teacher-applications/:id/status  (generic — for backward compat)
 */
export const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rejectionReason, changesRequested } = req.body;
  const adminId = req.user?._id;

  const application = await TeacherApplication.findById(id);
  if (!application) throw new ApiError(404, 'Teacher application not found');

  application.status = status;
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();

  if (status === 'Rejected') {
    application.rejectionReason = rejectionReason || 'لم يتم استيفاء كافة الشروط المطلوبة';
  }
  if (status === 'NeedsChanges') {
    application.changesRequested = changesRequested || '';
  }
  if (status === 'Approved') {
    application.approvedAt = new Date();
  }

  await application.save();

  // Promote user if approved
  if (status === 'Approved') {
    const user = await User.findOne({
      $or: [
        ...(application.userId ? [{ _id: application.userId }] : []),
        { email: application.email.toLowerCase() },
      ],
    });
    if (user) {
      user.role = 'TEACHER';
      await user.save();
    }
  }

  res.status(200).json(new ApiResponse(200, application, `تم تحديث حالة الطلب إلى ${status}`));
});

/**
 * DELETE /admin/teacher-applications/:id
 */
export const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const application = await TeacherApplication.findByIdAndDelete(req.params.id);
  if (!application) throw new ApiError(404, 'Teacher application not found');
  res.status(200).json(new ApiResponse(200, null, 'تم حذف الطلب بنجاح'));
});

/**
 * POST /admin/teacher-applications/bulk-approve
 */
export const bulkApproveApplications = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'يرجى تحديد طلب واحد على الأقل');
  }

  const adminId = req.user?._id;
  const applications = await TeacherApplication.find({ _id: { $in: ids } });

  for (const app of applications) {
    app.status = 'Approved';
    app.reviewedBy = adminId;
    app.reviewedAt = new Date();
    app.approvedAt = new Date();
    await app.save();

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

  res.status(200).json(
    new ApiResponse(200, { approvedCount: applications.length }, 'تم اعتماد الطلبات المحددة بنجاح')
  );
});

/**
 * POST /admin/teacher-applications/bulk-reject
 */
export const bulkRejectApplications = catchAsync(async (req: Request, res: Response) => {
  const { ids, rejectionReason } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'يرجى تحديد طلب واحد على الأقل');
  }

  const adminId = req.user?._id;
  const result = await TeacherApplication.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        status: 'Rejected',
        rejectionReason: rejectionReason || 'لم يتم استيفاء الشروط المطلوبة',
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    }
  );

  res.status(200).json(
    new ApiResponse(200, { rejectedCount: result.modifiedCount }, 'تم رفض الطلبات المحددة')
  );
});
