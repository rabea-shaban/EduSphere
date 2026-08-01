import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Assignment } from './assignment.model';
import { Course } from '../courses/course.model';
import { Submission } from '../submissions/submission.model';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Notification } from '../notifications/notification.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function assertCourseOwnership(
  courseId: string,
  userId: string,
  userRole: string
): Promise<any> {
  const course = await Course.findById(new mongoose.Types.ObjectId(courseId)).select('teacher title');
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const roleUpper = String(userRole || '').toUpperCase();
  const isAdmin = roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN';
  const isStudent = roleUpper === 'STUDENT';

  if (isStudent) {
    return course;
  }

  const courseTeacherId = (course as any).teacher?.toString() || (course as any).instructor?.toString() || (course as any).createdBy?.toString();
  if (!isAdmin && courseTeacherId !== userId.toString()) {
    throw new ApiError(
      403,
      'Access denied. You can only manage assignments in your own courses.'
    );
  }

  return course;
}

async function assertAssignmentOwnership(
  assignmentId: string,
  userId: string,
  userRole: string
): Promise<any> {
  const assignment = await (Assignment.findById(new mongoose.Types.ObjectId(assignmentId)) as any).setOptions({
    withDeleted: true,
  });
  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  const roleUpper = String(userRole || '').toUpperCase();
  if (roleUpper !== 'STUDENT' && assignment.courseId) {
    await assertCourseOwnership(assignment.courseId.toString(), userId, userRole);
  }

  return assignment;
}

async function notifyStudentsAboutAssignment(assignment: any): Promise<void> {
  try {
    if (!assignment || !assignment.courseId) return;
    const courseId = typeof assignment.courseId === 'object' ? assignment.courseId._id : assignment.courseId;
    const enrollments = await Enrollment.find({ courseId, status: { $ne: 'Cancelled' } }).select('studentId').lean();
    const studentIds = enrollments.map((e: any) => e.studentId).filter(Boolean);

    if (studentIds.length === 0) return;

    const notifications = studentIds.map((studentId: any) => ({
      recipientId: studentId,
      title: `واجب جديد: "${assignment.title}"`,
      message: `تم نشر واجب جديد في كورسك الدراسي. موعد التسليم: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('ar-EG') : 'متاح الآن'}.`,
      type: 'Assignment',
      priority: 'High',
      deliveryChannel: ['InApp'],
      isRead: false,
    }));

    await Notification.insertMany(notifications);
  } catch (err) {
    console.error('Failed to dispatch assignment notifications:', err);
  }
}

async function logActivity(
  userId: string,
  userName: string,
  userRole: string,
  action: string,
  details?: object
): Promise<void> {
  await ActivityLog.create({
    userId: new mongoose.Types.ObjectId(userId) as any,
    userName,
    userRole,
    action,
    category: 'Course',
    module: 'Assignments',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

// ─── Controller Handlers ─────────────────────────────────────────────────────

/**
 * GET /teacher/assignments
 * Get assignments with search & filters (supports Students & Teachers).
 */
export const getTeacherAssignments = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 50, search, courseId, lessonId, status, sort } = req.query;
  const userId = req.user!._id.toString();
  const userRole = String(req.user!.role || '').toUpperCase();

  const courseFilter: any = { isDeleted: { $ne: true } };

  if (userRole === 'STUDENT') {
    courseFilter.status = 'Published';
    const studentEnrollments = await Enrollment.find({ studentId: userId, status: { $ne: 'Cancelled' } }).select('courseId').lean();
    const enrolledCourseIds = studentEnrollments.map((e: any) => e.courseId).filter(Boolean);

    if (enrolledCourseIds.length > 0) {
      courseFilter.$or = [
        { courseId: { $in: enrolledCourseIds } },
        { courseId: { $exists: false } },
        { courseId: null },
      ];
    } else {
      courseFilter.$or = [{ courseId: { $exists: false } }, { courseId: null }];
    }
  } else if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
    const teacherCourses = await Course.find({
      $or: [{ teacher: userId }, { instructor: userId }, { createdBy: userId }],
      isDeleted: { $ne: true },
    }).select('_id').lean();
    const courseIds = teacherCourses.map((c: any) => c._id);
    courseFilter.$or = [
      { courseId: { $in: courseIds } },
      { createdBy: userId },
      { teacherId: userId },
      { courseId: { $exists: false } },
      { courseId: null },
    ];
  }

  if (courseId) courseFilter.courseId = courseId;
  if (lessonId) courseFilter.lessonId = lessonId;
  if (status) courseFilter.status = status;

  const filter: any = { ...courseFilter };
  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  let sortBy: any = { createdAt: -1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const [assignments, total] = await Promise.all([
    Assignment.find(filter)
      .populate('courseId', 'title slug')
      .populate('lessonId', 'title')
      .populate('teacherId', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Assignment.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        assignments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Assignments retrieved successfully'
    )
  );
});

/**
 * GET /teacher/assignments/:id
 */
export const getAssignmentById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment retrieved successfully'));
});

/**
 * POST /teacher/assignments
 */
export const createAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  if (req.body.courseId) {
    await assertCourseOwnership(req.body.courseId, userId, userRole);
  }

  const payload = {
    ...req.body,
    teacherId: userId,
    unitId: req.body.sectionId || req.body.unitId,
  };

  const assignment = await Assignment.create(payload);

  if (assignment.status === 'Published') {
    notifyStudentsAboutAssignment(assignment).catch(() => {});
  }

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_CREATED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
    courseId: assignment.courseId,
  });

  res.status(201).json(new ApiResponse(201, assignment, 'Assignment created successfully'));
});

/**
 * PUT/PATCH /teacher/assignments/:id
 */
export const updateAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  if (req.body.courseId && req.body.courseId !== assignment.courseId?.toString()) {
    await assertCourseOwnership(req.body.courseId, userId, userRole);
  }

  if (req.body.sectionId) {
    req.body.unitId = req.body.sectionId;
  }

  Object.assign(assignment, req.body);
  await assignment.save();

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_UPDATED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment updated successfully'));
});

/**
 * DELETE /teacher/assignments/:id (Soft Delete)
 */
export const deleteAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  assignment.isDeleted = true;
  assignment.deletedAt = new Date();
  await assignment.save({ validateBeforeSave: false });

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_DELETED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, null, 'Assignment deleted successfully'));
});

/**
 * PATCH /teacher/assignments/:id/publish
 */
export const publishAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  assignment.status = 'Published';
  await assignment.save();

  notifyStudentsAboutAssignment(assignment).catch(() => {});

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_PUBLISHED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment published successfully'));
});

/**
 * PATCH /teacher/assignments/:id/unpublish
 */
export const unpublishAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  assignment.status = 'Draft';
  await assignment.save();

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_UNPUBLISHED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment unpublished successfully'));
});

/**
 * PATCH /teacher/assignments/:id/archive
 */
export const archiveAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  assignment.status = 'Archived';
  await assignment.save();

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_ARCHIVED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment archived successfully'));
});

/**
 * PATCH /teacher/assignments/:id/restore
 */
export const restoreAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  assignment.isDeleted = false;
  assignment.deletedAt = null;
  assignment.status = 'Draft';
  await assignment.save({ validateBeforeSave: false });

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_RESTORED', {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
  });

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment restored successfully'));
});

/**
 * POST /teacher/assignments/:id/duplicate
 */
export const duplicateAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const source = await assertAssignmentOwnership(id, userId, userRole);

  const clonedData = source.toObject() as any;
  delete clonedData._id;
  delete clonedData.createdAt;
  delete clonedData.updatedAt;
  delete clonedData.__v;

  clonedData.title = `${source.title} - نسخة`;
  clonedData.status = 'Draft';
  clonedData.isDeleted = false;
  clonedData.deletedAt = null;

  const duplicated = await Assignment.create(clonedData);

  await logActivity(userId, userName, userRole, 'ASSIGNMENT_DUPLICATED', {
    sourceAssignmentId: id,
    duplicatedAssignmentId: duplicated._id,
  });

  res.status(201).json(new ApiResponse(201, duplicated, 'Assignment duplicated successfully'));
});

/**
 * GET /teacher/assignments/:id/submissions
 */
export const getAssignmentSubmissions = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const { page = 1, limit = 50, status } = req.query;
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  await assertAssignmentOwnership(id, userId, userRole);

  const filter: any = { assignmentId: id };
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const submissions = await Submission.find(filter)
    .populate('studentId', 'firstName lastName username email avatar')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Submission.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        submissions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Submissions retrieved successfully'
    )
  );
});

/**
 * GET /teacher/assignments/:id/analytics
 */
export const getAssignmentAnalytics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const assignment = await assertAssignmentOwnership(id, userId, userRole);

  const submissions = await Submission.find({ assignmentId: id }).lean();
  const submissionsCount = submissions.length;

  let averageGrade = 0;
  let highestGrade = 0;
  let lowestGrade = 0;
  let passCount = 0;
  let failCount = 0;
  let lateCount = 0;

  const totalMarks = assignment.totalMarks || 100;
  const passingMarks = assignment.passingMarks || 60;

  if (submissionsCount > 0) {
    let totalGrade = 0;
    lowestGrade = submissions[0].grade || 0;

    submissions.forEach((s) => {
      const grade = s.grade || 0;
      totalGrade += grade;
      if (grade > highestGrade) highestGrade = grade;
      if (grade < lowestGrade) lowestGrade = grade;
      if (grade >= passingMarks) passCount++;
      else failCount++;
      if (s.status === 'Late') lateCount++;
    });

    averageGrade = Math.round((totalGrade / submissionsCount) * 10) / 10;
  }

  const passRate = submissionsCount > 0 ? Math.round((passCount / submissionsCount) * 100) : 0;
  const failureRate = submissionsCount > 0 ? Math.round((failCount / submissionsCount) * 100) : 0;
  const lateSubmissionRate = submissionsCount > 0 ? Math.round((lateCount / submissionsCount) * 100) : 0;

  const analytics = {
    assignmentId: assignment._id,
    assignmentTitle: assignment.title,
    totalMarks,
    passingMarks,
    submissionsCount,
    averageGrade,
    highestGrade,
    lowestGrade,
    passCount,
    failCount,
    passRate,
    failureRate,
    lateCount,
    lateSubmissionRate,
  };

  res.status(200).json(new ApiResponse(200, analytics, 'Assignment analytics generated successfully'));
});
