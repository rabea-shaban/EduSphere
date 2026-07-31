import { Request, Response } from 'express';
import slugify from 'slugify';
import { Course } from './course.model';
import { Unit } from '../units/unit.model';
import { Lesson } from '../lessons/lesson.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Course.
 */
export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const courseData = { ...req.body };
  if (!courseData.teacher && req.user) {
    courseData.teacher = req.user._id;
  }

  const title = courseData.title || req.body.title || '';
  const teacherId = courseData.teacher;

  let course = await Course.findOne({ title: title.trim() });
  if (course) {
    if (teacherId && course.teacher.toString() === teacherId.toString()) {
      // Re-use and update existing course if created by the same teacher
      course = await Course.findByIdAndUpdate(course._id, courseData, { new: true }) as any;
    } else {
      throw new ApiError(400, 'عنوان الكورس مستخدم بالفعل، يرجى تغيير العنوان أو إضافة تمييز بسيط');
    }
  }

  // Ensure language field does not trigger MongoDB text index language override error
  if (courseData.language) {
    courseData.language = String(courseData.language).toLowerCase();
  } else {
    courseData.language = 'arabic';
  }

  // Map level if Arabic string provided or default to 'Beginner'
  if (courseData.level === 'جميع المراحل' || !courseData.level) {
    courseData.level = 'Beginner';
  } else if (courseData.level === 'مبتدئ') {
    courseData.level = 'Beginner';
  } else if (courseData.level === 'متوسط') {
    courseData.level = 'Intermediate';
  } else if (courseData.level === 'متقدم') {
    courseData.level = 'Advanced';
  }

  if (!course) {
    course = await Course.create(courseData);
  }

  // Send notification to course owner
  try {
    if (req.user?._id) {
      const notif = await Notification.create({
        recipientId: req.user._id,
        title: 'تم إنشاء كورس جديد بنجاح 📚',
        message: `تم إنشاء كورس "${course.title}" بنجاح. يمكنك الآن الدخول لإنشاء الدروس والوحدات.`,
        type: 'Course',
        priority: 'High',
        deliveryChannel: ['InApp'],
        isRead: false,
      });
      emitToUser(req.user._id, 'notification', notif);
    }
  } catch {
    // Non-critical
  }

  res.status(201).json(new ApiResponse(201, course, 'Course created successfully'));
});

/**
 * Get all Courses with filters, search, pagination, and sorting.
 */
export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    level,
    isFree,
    isFeatured,
    teacherId,
    academicYearId,
    gradeId,
    subjectId,
    termId,
    sort,
  } = req.query;

  const filter: any = { isDeleted: { $ne: true } };

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }];
  }

  if (status) filter.status = status;
  if (level) filter.level = level;
  if (isFree !== undefined) filter.isFree = isFree === 'true';
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  if (teacherId) {
    filter.teacher = teacherId;
  } else if (req.user && (req.user.role === 'TEACHER' || req.path.includes('/teacher') || req.baseUrl.includes('/teacher'))) {
    filter.teacher = req.user._id;
  }

  if (academicYearId) filter.academicYear = academicYearId;
  if (gradeId) filter.grade = gradeId;
  if (subjectId) filter.subject = subjectId;
  if (termId) filter.term = termId;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortBy: any = { createdAt: -1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('teacher', 'firstName lastName username email avatar')
      .populate('academicYear', 'title')
      .populate('grade', 'name')
      .populate('subject', 'name slug icon color')
      .populate('term', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Course.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Courses retrieved successfully'
    )
  );
});

/**
 * Get Course by ID.
 */
export const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id)
    .populate('teacher', 'firstName lastName username email avatar')
    .populate('academicYear', 'title')
    .populate('grade', 'name')
    .populate('subject', 'name slug icon color')
    .populate('term', 'name');

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.status(200).json(new ApiResponse(200, course, 'Course retrieved successfully'));
});

/**
 * Update Course details.
 */
export const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const { title, thumbnailUrl, level } = req.body;
  if (title && title !== course.title) {
    const duplicate = await Course.findOne({ title: title.trim(), _id: { $ne: id } });
    if (duplicate) {
      throw new ApiError(400, 'عنوان الكورس مستخدم بالفعل، يرجى اختيار عنوان آخر');
    }
    course.slug = slugify(title, { lower: true, strict: true });
  }

  const updateData = { ...req.body };
  if (thumbnailUrl && !updateData.thumbnail) {
    updateData.thumbnail = thumbnailUrl;
  }

  // Map Arabic level to enum
  if (level === 'جميع المراحل' || !level) {
    updateData.level = 'Beginner';
  } else if (level === 'مبتدئ') {
    updateData.level = 'Beginner';
  } else if (level === 'متوسط') {
    updateData.level = 'Intermediate';
  } else if (level === 'متقدم') {
    updateData.level = 'Advanced';
  }

  Object.assign(course, updateData);
  await course.save();

  res.status(200).json(new ApiResponse(200, course, 'Course updated successfully'));
});

/**
 * Delete Course (cascades to delete associated Units and Lessons).
 */
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Cascade Deletion
  await Lesson.deleteMany({ courseId: id });
  await Unit.deleteMany({ courseId: id });
  await course.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Course and all its units and lessons deleted successfully'));
});

/**
 * Publish a Course.
 */
export const publishCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(id, { status: 'Published' }, { new: true });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.status(200).json(new ApiResponse(200, course, 'Course published successfully'));
});

/**
 * Archive a Course.
 */
export const archiveCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(id, { status: 'Archived' }, { new: true });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.status(200).json(new ApiResponse(200, course, 'Course archived successfully'));
});

/**
 * Deep duplicate a course (clones course, its units, and its lessons).
 */
export const duplicateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const sourceCourse = await Course.findById(id);
  if (!sourceCourse) {
    throw new ApiError(404, 'Course not found');
  }

  // 1. Generate unique title
  let newTitle = `${sourceCourse.title} - Copy`;
  let titleCollision = true;
  let attempt = 1;
  while (titleCollision) {
    const existing = await Course.findOne({ title: newTitle });
    if (!existing) {
      titleCollision = false;
    } else {
      newTitle = `${sourceCourse.title} - Copy ${attempt}`;
      attempt++;
    }
  }

  // 2. Clone course details
  const clonedCourseData = sourceCourse.toObject() as any;
  const oldCourseId = clonedCourseData._id;
  delete clonedCourseData._id;
  delete clonedCourseData.createdAt;
  delete clonedCourseData.updatedAt;
  delete clonedCourseData.slug;
  clonedCourseData.title = newTitle;
  clonedCourseData.status = 'Draft'; // Duplicated course starts as draft
  clonedCourseData.enrollmentCount = 0;
  clonedCourseData.rating = 0;
  clonedCourseData.reviewCount = 0;

  const duplicatedCourse = await Course.create(clonedCourseData);

  // 3. Duplicate Units
  const sourceUnits = await Unit.find({ courseId: oldCourseId }).sort({ order: 1 });

  for (const unit of sourceUnits) {
    const clonedUnitData = unit.toObject() as any;
    const oldUnitId = clonedUnitData._id;
    delete clonedUnitData._id;
    delete clonedUnitData.createdAt;
    delete clonedUnitData.updatedAt;
    clonedUnitData.courseId = duplicatedCourse._id;

    const duplicatedUnit = await Unit.create(clonedUnitData);

    // 4. Duplicate Lessons under this unit
    const sourceLessons = await Lesson.find({ unitId: oldUnitId }).sort({ order: 1 });
    for (const lesson of sourceLessons) {
      const clonedLessonData = lesson.toObject() as any;
      delete clonedLessonData._id;
      delete clonedLessonData.createdAt;
      delete clonedLessonData.updatedAt;
      delete clonedLessonData.slug;
      clonedLessonData.courseId = duplicatedCourse._id;
      clonedLessonData.unitId = duplicatedUnit._id;

      await Lesson.create(clonedLessonData);
    }
  }

  res.status(201).json(new ApiResponse(201, duplicatedCourse, 'Course duplicated successfully'));
});

/**
 * Restore an archived Course back to Draft/Published.
 */
export const restoreCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(id, { status: 'Draft' }, { new: true });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  res.status(200).json(new ApiResponse(200, course, 'Course restored to draft successfully'));
});

