import { Request, Response } from 'express';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { Lesson } from './lesson.model';
import { Section } from '../sections/section.model';
import { Unit } from '../units/unit.model';
import { Course } from '../courses/course.model';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// ─── Security & Helper Functions ─────────────────────────────────────────────

/**
 * Verify that section exists and teacher owns the parent course.
 */
async function assertSectionAndCourseOwnership(
  sectionId: string,
  userId: string,
  userRole: string
): Promise<{ section: any; course: any }> {
  let section: any = await Section.findById(sectionId);
  let courseId = section?.courseId;

  if (!section) {
    const unit = await Unit.findById(sectionId);
    if (unit) {
      section = unit;
      courseId = unit.courseId;
    }
  }

  if (!section) {
    throw new ApiError(404, 'Section or Unit not found');
  }

  const course = await Course.findById(courseId).select('teacher title');
  if (!course) {
    throw new ApiError(404, 'Course not found for this section');
  }

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  if (!isAdmin && course.teacher.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      'Access denied. You can only manage lessons in your own courses.'
    );
  }

  return { section, course };
}

/**
 * Verify that lesson exists and teacher owns the parent course.
 */
async function assertLessonAndCourseOwnership(
  lessonId: string,
  userId: string,
  userRole: string
): Promise<{ lesson: any; course: any }> {
  const lesson = await (Lesson.findById(new mongoose.Types.ObjectId(lessonId)) as any).setOptions({
    withDeleted: true,
  });
  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }

  const course = await Course.findById(lesson.courseId).select('teacher title');
  if (!course) {
    throw new ApiError(404, 'Course not found for this lesson');
  }

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  if (!isAdmin && course.teacher.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      'Access denied. You can only manage lessons in your own courses.'
    );
  }

  return { lesson, course };
}

/**
 * Record an audit log entry.
 */
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
    module: 'Lessons',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

// ─── Controllers ────────────────────────────────────────────────────────────

/**
 * GET /teacher/sections/:sectionId/lessons
 * Get all lessons for a specific section.
 */
export const getLessonsBySection = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const sectionId = String(req.params.sectionId);
  const { page = 1, limit = 50, search, lessonType, status, sort } = req.query;

  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  await assertSectionAndCourseOwnership(sectionId, userId, userRole);

  const filter: any = {
    $or: [{ sectionId }, { unitId: sectionId }],
  };

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }
  if (lessonType) {
    filter.lessonType = lessonType;
  }
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const lessons = await Lesson.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Lesson.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lessons,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Lessons retrieved successfully'
    )
  );
});

/**
 * GET /teacher/lessons
 * Global search & filter across all lessons belonging to the teacher.
 */
export const searchTeacherLessons = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 20,
    search,
    lessonType,
    status,
    sectionId,
    courseId,
    sort,
  } = req.query;

  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  // Filter courses owned by this teacher
  const courseFilter: any = {};
  if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
    const teacherCourses = await Course.find({ teacher: userId }).select('_id').lean();
    const courseIds = teacherCourses.map((c: any) => c._id);
    if (courseIds.length === 0) {
      res.status(200).json(
        new ApiResponse(200, { lessons: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }, 'No lessons found')
      );
      return;
    }
    courseFilter.courseId = { $in: courseIds };
  }

  if (courseId) {
    courseFilter.courseId = courseId;
  }
  if (sectionId) {
    courseFilter.$or = [{ sectionId }, { unitId: sectionId }];
  }

  const filter: any = { ...courseFilter };

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }
  if (lessonType) {
    filter.lessonType = lessonType;
  }
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  let sortBy: any = { createdAt: -1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const lessons = await Lesson.find(filter)
    .populate('sectionId', 'title order')
    .populate('courseId', 'title slug')
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Lesson.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lessons,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Lessons retrieved successfully'
    )
  );
});

/**
 * GET /teacher/lessons/:id
 * Get a single lesson by ID.
 */
export const getLessonById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson retrieved successfully'));
});

/**
 * POST /teacher/sections/:sectionId/lessons or POST /teacher/lessons
 * Create a new lesson.
 */
export const createLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const sectionId = req.params.sectionId
    ? String(req.params.sectionId)
    : req.body.sectionId || req.body.unitId;

  if (!sectionId) {
    throw new ApiError(400, 'sectionId or unitId is required');
  }

  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { section, course } = await assertSectionAndCourseOwnership(sectionId, userId, userRole);

  let { order } = req.body;

  // Auto-compute order if not provided
  if (!order) {
    const lastLesson = await Lesson.findOne({
      $or: [{ sectionId }, { unitId: sectionId }],
    })
      .sort({ order: -1 })
      .select('order')
      .lean();
    order = lastLesson ? (lastLesson.order as number) + 1 : 1;
  } else {
    // Collision check
    const existingOrder = await Lesson.findOne({
      $or: [{ sectionId }, { unitId: sectionId }],
      order,
    });
    if (existingOrder) {
      const lastLesson = await Lesson.findOne({
        $or: [{ sectionId }, { unitId: sectionId }],
      })
        .sort({ order: -1 })
        .select('order')
        .lean();
      order = lastLesson ? (lastLesson.order as number) + 1 : order + 1;
    }
  }

  const lessonData = {
    ...req.body,
    sectionId: section._id,
    unitId: section._id,
    courseId: course._id,
    order,
  };

  if (lessonData.title) {
    lessonData.slug =
      slugify(lessonData.title, { lower: true, strict: true }) +
      '-' +
      Math.floor(1000 + Math.random() * 9000);
  }

  const lesson = await Lesson.create(lessonData);

  // Update section totalLessons counter
  await Section.findByIdAndUpdate(section._id, { $inc: { totalLessons: 1 } });

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_CREATED', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    sectionId: section._id,
    courseId: course._id,
  });

  res.status(201).json(new ApiResponse(201, lesson, 'Lesson created successfully'));
});

/**
 * PUT/PATCH /teacher/lessons/:id
 * Update a lesson.
 */
export const updateLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  const { title, order } = req.body;
  const targetSectionId = lesson.sectionId || lesson.unitId;

  // Order collision check
  if (order && order !== lesson.order) {
    const existingOrder = await Lesson.findOne({
      $or: [{ sectionId: targetSectionId }, { unitId: targetSectionId }],
      order,
      _id: { $ne: id },
    });
    if (existingOrder) {
      throw new ApiError(409, `A lesson with order ${order} already exists in this section`);
    }
  }

  if (title && title !== lesson.title) {
    req.body.slug =
      slugify(title, { lower: true, strict: true }) +
      '-' +
      Math.floor(1000 + Math.random() * 9000);
  }

  // Sync isPublished with status
  if (req.body.status === 'Published') {
    req.body.isPublished = true;
  } else if (req.body.status && req.body.status !== 'Published') {
    req.body.isPublished = false;
  }

  const oldData = { title: lesson.title, status: lesson.status, order: lesson.order };
  Object.assign(lesson, req.body);
  await lesson.save();

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_UPDATED', {
    lessonId: lesson._id,
    sectionId: lesson.sectionId,
    courseId: lesson.courseId,
    oldData,
    newData: req.body,
  });

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson updated successfully'));
});

/**
 * DELETE /teacher/lessons/:id
 * Soft-delete a lesson (sets isDeleted=true).
 */
export const deleteLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  lesson.isDeleted = true;
  lesson.deletedAt = new Date();
  await lesson.save({ validateBeforeSave: false });

  // Update section totalLessons counter
  if (lesson.sectionId || lesson.unitId) {
    const secId = lesson.sectionId || lesson.unitId;
    await Section.findByIdAndUpdate(secId, { $inc: { totalLessons: -1 } });
  }

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_DELETED', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    sectionId: lesson.sectionId,
    courseId: lesson.courseId,
  });

  res.status(200).json(new ApiResponse(200, null, 'Lesson deleted successfully'));
});

/**
 * PATCH /teacher/lessons/:id/archive
 * Archive a lesson (status = 'Archived').
 */
export const archiveLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  if (lesson.status === 'Archived') {
    throw new ApiError(409, 'Lesson is already archived');
  }

  lesson.status = 'Archived';
  lesson.isPublished = false;
  await lesson.save();

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_ARCHIVED', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    sectionId: lesson.sectionId,
    courseId: lesson.courseId,
  });

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson archived successfully'));
});

/**
 * PATCH /teacher/lessons/:id/restore
 * Restore a soft-deleted or archived lesson.
 */
export const restoreLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  lesson.isDeleted = false;
  lesson.deletedAt = undefined;
  lesson.status = 'Draft';
  lesson.isPublished = false;
  await lesson.save({ validateBeforeSave: false });

  if (lesson.sectionId || lesson.unitId) {
    const secId = lesson.sectionId || lesson.unitId;
    await Section.findByIdAndUpdate(secId, { $inc: { totalLessons: 1 } });
  }

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_RESTORED', {
    lessonId: lesson._id,
    lessonTitle: lesson.title,
    sectionId: lesson.sectionId,
    courseId: lesson.courseId,
  });

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson restored successfully'));
});

/**
 * POST /teacher/lessons/:id/duplicate
 * Duplicate a lesson inside the same section.
 */
export const duplicateLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const { lesson: sourceLesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  const targetSectionId = sourceLesson.sectionId || sourceLesson.unitId;

  // Compute next order
  const lastLesson = await Lesson.findOne({
    $or: [{ sectionId: targetSectionId }, { unitId: targetSectionId }],
  })
    .sort({ order: -1 })
    .select('order')
    .lean();

  const newOrder = lastLesson ? (lastLesson.order as number) + 1 : 1;

  const clonedData = sourceLesson.toObject() as any;
  delete clonedData._id;
  delete clonedData.createdAt;
  delete clonedData.updatedAt;
  delete clonedData.slug;
  delete clonedData.__v;

  clonedData.title = `${sourceLesson.title} - نسخة`;
  clonedData.status = 'Draft';
  clonedData.isPublished = false;
  clonedData.isDeleted = false;
  delete clonedData.deletedAt;
  clonedData.order = newOrder;

  const duplicatedLesson = await Lesson.create(clonedData);

  if (targetSectionId) {
    await Section.findByIdAndUpdate(targetSectionId, { $inc: { totalLessons: 1 } });
  }

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_DUPLICATED', {
    sourceLessonId: id,
    duplicatedLessonId: duplicatedLesson._id,
    sectionId: targetSectionId,
    courseId: sourceLesson.courseId,
  });

  res.status(201).json(new ApiResponse(201, duplicatedLesson, 'Lesson duplicated successfully'));
});

/**
 * PATCH /teacher/lessons/reorder
 * Bulk reorder lessons.
 */
export const reorderLessons = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;
  const { sectionId, items } = req.body as { sectionId: string; items: { id: string; order: number }[] };

  if (!sectionId || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'sectionId and items array are required');
  }

  await assertSectionAndCourseOwnership(sectionId, userId, userRole);

  const bulkOps = items.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(id) },
      update: { $set: { order } },
    },
  }));

  await Lesson.bulkWrite(bulkOps);

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_REORDERED', {
    sectionId,
    items,
  });

  res.status(200).json(new ApiResponse(200, null, 'Lessons reordered successfully'));
});

/**
 * PATCH /teacher/lessons/:id/move
 * Move a lesson to another section.
 */
export const moveLesson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const { targetSectionId } = req.body;

  if (!targetSectionId) {
    throw new ApiError(400, 'targetSectionId is required');
  }

  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  // 1. Verify current lesson & course ownership
  const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);

  // 2. Verify target section & course ownership
  const { section: targetSection } = await assertSectionAndCourseOwnership(
    targetSectionId,
    userId,
    userRole
  );

  const oldSectionId = lesson.sectionId || lesson.unitId;

  // Compute order in target section
  const lastLesson = await Lesson.findOne({
    $or: [{ sectionId: targetSection._id }, { unitId: targetSection._id }],
  })
    .sort({ order: -1 })
    .select('order')
    .lean();

  const newOrder = req.body.order || (lastLesson ? (lastLesson.order as number) + 1 : 1);

  lesson.sectionId = targetSection._id;
  lesson.unitId = targetSection._id;
  lesson.courseId = targetSection.courseId;
  lesson.order = newOrder;
  await lesson.save();

  // Update totalLessons on old and new section
  if (oldSectionId && oldSectionId.toString() !== targetSection._id.toString()) {
    await Section.findByIdAndUpdate(oldSectionId, { $inc: { totalLessons: -1 } });
    await Section.findByIdAndUpdate(targetSection._id, { $inc: { totalLessons: 1 } });
  }

  // Audit log
  await logActivity(userId, userName, userRole, 'LESSON_MOVED', {
    lessonId: lesson._id,
    fromSectionId: oldSectionId,
    toSectionId: targetSection._id,
    courseId: targetSection.courseId,
  });

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson moved successfully'));
});

/**
 * Public/Student endpoint: Get lessons by course or unit (backward compatibility)
 */
export const getAllLessons = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 50, search, unitId, sectionId, courseId, lessonType, status, isPublished, sort } = req.query;

  // Explicitly exclude deleted lessons so countDocuments is consistent with find()
  // (countDocuments does NOT trigger the pre(/^find/) soft-delete hook)
  const filter: any = { isDeleted: { $ne: true } };

  if (search) filter.title = new RegExp(search as string, 'i');
  if (unitId || sectionId) {
    const secId = sectionId || unitId;
    filter.$or = [{ sectionId: secId }, { unitId: secId }];
  }
  if (courseId) filter.courseId = courseId;
  if (lessonType) filter.lessonType = lessonType;
  if (status) filter.status = status;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(200, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const [lessons, total] = await Promise.all([
    Lesson.find(filter)
      .populate('sectionId', 'title order')
      .populate('unitId', 'title order')
      .populate('courseId', 'title slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Lesson.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lessons,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Lessons retrieved successfully'
    )
  );
});
