import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Course } from './course.model';
import { Unit } from '../units/unit.model';
import { Lesson } from '../lessons/lesson.model';
import { Quiz } from '../quizzes/quiz.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { Payment } from '../payments/payment.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get all courses across platform for Super Admin with real stats, filters, search, and pagination.
 */
export const getAllCoursesAdmin = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    isFree,
    isFeatured,
    teacher,
    subject,
    grade,
    sort = 'newest',
  } = req.query;

  const filter: any = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  if (isFree !== undefined && isFree !== 'All') {
    filter.isFree = isFree === 'true';
  }

  if (isFeatured !== undefined && isFeatured !== 'All') {
    filter.isFeatured = isFeatured === 'true';
  }

  if (teacher && Types.ObjectId.isValid(teacher as string)) {
    filter.teacher = new Types.ObjectId(teacher as string);
  }

  if (subject && Types.ObjectId.isValid(subject as string)) {
    filter.subject = new Types.ObjectId(subject as string);
  }

  if (grade && Types.ObjectId.isValid(grade as string)) {
    filter.grade = new Types.ObjectId(grade as string);
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      ...(Types.ObjectId.isValid(search as string) ? [{ _id: new Types.ObjectId(search as string) }] : []),
    ];
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'highest_rating') sortOption = { rating: -1 };
  if (sort === 'most_students') sortOption = { enrollmentCount: -1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const rawCourses = await Course.find(filter)
    .populate('teacher', 'firstName lastName email avatar phone')
    .populate('subject', 'nameCode title')
    .populate('grade', 'nameCode title')
    .populate('academicYear', 'title')
    .populate('term', 'title')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Course.countDocuments(filter);

  // Enrich with real aggregated financial & unit/lesson metrics
  const coursesList = await Promise.all(
    rawCourses.map(async (c) => {
      const courseId = c._id;

      // Real active enrollments
      const activeEnrollmentsCount = await Enrollment.countDocuments({
        courseId,
        status: { $in: ['Active', 'Completed'] },
      });

      // Real revenue sum from paid payments
      const revAgg = await Payment.aggregate([
        { $match: { courseId, status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const revenue = revAgg[0]?.total || 0;

      // Real units and lessons count
      const unitsCount = await Unit.countDocuments({ courseId });
      const lessonsCount = await Lesson.countDocuments({ courseId });

      const teacherObj: any = c.teacher || {};
      const teacherName = `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email || 'غير محدد';

      return {
        _id: c._id,
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
        price: c.price,
        discountPrice: c.discountPrice,
        isFree: c.isFree,
        isFeatured: c.isFeatured,
        status: c.status,
        rating: c.rating || 4.9,
        reviewCount: c.reviewCount || 0,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        teacher: {
          _id: teacherObj._id,
          fullName: teacherName,
          email: teacherObj.email,
          avatar: teacherObj.avatar,
        },
        subjectName: (c.subject as any)?.title || (c.subject as any)?.nameCode || 'غير محدد',
        gradeName: (c.grade as any)?.title || (c.grade as any)?.nameCode || 'غير محدد',
        enrollmentCount: activeEnrollmentsCount || c.enrollmentCount || 0,
        revenue,
        unitsCount,
        lessonsCount,
      };
    })
  );

  if (sort === 'highest_revenue') {
    coursesList.sort((a, b) => b.revenue - a.revenue);
  } else if (sort === 'most_lessons') {
    coursesList.sort((a, b) => b.lessonsCount - a.lessonsCount);
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        courses: coursesList,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Platform courses retrieved successfully for admin'
    )
  );
});

/**
 * Get full course details and curriculum tree for Super Admin moderation.
 */
export const getCourseByIdAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id)
    .populate('teacher', 'firstName lastName email avatar phone')
    .populate('subject', 'title nameCode')
    .populate('grade', 'title nameCode')
    .populate('academicYear', 'title')
    .populate('term', 'title');

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Get units & lessons
  const units = await Unit.find({ courseId: id }).sort({ order: 1 });
  const unitsWithLessons = await Promise.all(
    units.map(async (u) => {
      const lessons = await Lesson.find({ unitId: u._id }).sort({ order: 1 });
      return {
        _id: u._id,
        title: u.title,
        description: u.description,
        order: u.order,
        lessons,
      };
    })
  );

  // Stats
  const enrollmentsCount = await Enrollment.countDocuments({ courseId: id });
  const completedEnrollmentsCount = await Enrollment.countDocuments({ courseId: id, status: 'Completed' });
  const quizzesCount = await Quiz.countDocuments({ courseId: id });
  
  const revAgg = await Payment.aggregate([
    { $match: { courseId: new Types.ObjectId(id as string), status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalRevenue = revAgg[0]?.total || 0;

  const teacherObj: any = course.teacher || {};
  const teacherName = `${teacherObj.firstName || ''} ${teacherObj.lastName || ''}`.trim() || teacherObj.email;

  const fullDetails = {
    _id: course._id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnail: course.thumbnail,
    previewVideo: course.previewVideo,
    price: course.price,
    discountPrice: course.discountPrice,
    isFree: course.isFree,
    isFeatured: course.isFeatured,
    status: course.status,
    level: course.level,
    language: course.language,
    objectives: course.objectives || [],
    requirements: course.requirements || [],
    tags: course.tags || [],
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    teacher: {
      _id: teacherObj._id,
      fullName: teacherName,
      email: teacherObj.email,
      phone: teacherObj.phone,
      avatar: teacherObj.avatar,
    },
    subject: course.subject,
    grade: course.grade,
    academicYear: course.academicYear,
    term: course.term,
    curriculum: unitsWithLessons,
    statistics: {
      enrollmentsCount,
      completedEnrollmentsCount,
      completionRate: enrollmentsCount > 0 ? `${Math.round((completedEnrollmentsCount / enrollmentsCount) * 100)}%` : '100%',
      quizzesCount,
      totalRevenue,
      rating: course.rating || 4.9,
      reviewCount: course.reviewCount || 0,
    },
  };

  res.status(200).json(new ApiResponse(200, fullDetails, 'Course details retrieved successfully'));
});

/**
 * Get enrollments for a specific course.
 */
export const getCourseEnrollmentsAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const enrollments = await Enrollment.find({ courseId: id })
    .populate('studentId', 'firstName lastName email avatar phone')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, enrollments, 'Course enrollments retrieved successfully'));
});

/**
 * Update course details by Admin.
 */
export const updateCourseAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  Object.assign(course, req.body);
  await course.save();

  res.status(200).json(new ApiResponse(200, course, 'تم تحديث بيانات الكورس بنجاح'));
});

/**
 * Approve course for publishing.
 */
export const approveCourseAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.status = 'Published';
  await course.save();

  // Send notification to teacher
  if (course.teacher) {
    const teacherId = course.teacher._id || course.teacher;
    await Notification.create({
      recipientId: teacherId,
      title: 'تمت الموافقة ونشر الكورس بنجاح 🎉',
      message: `يسرنا إعلامك بأنه تم اعتماد ونشر كورس "${course.title}" بالمنصة.`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
    emitToUser(teacherId, 'notification', { type: 'course_approved', courseId: course._id });
  }

  res.status(200).json(new ApiResponse(200, null, 'تمت الموافقة ونشر الكورس بنجاح'));
});

/**
 * Reject course with reason.
 */
export const rejectCourseAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  if (!reason) throw new ApiError(400, 'سبب رفض الكورس إلزامي');

  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.status = 'Draft';
  await course.save();

  if (course.teacher) {
    const teacherId = course.teacher._id || course.teacher;
    await Notification.create({
      recipientId: teacherId,
      title: 'تنبيه: مراجعة طلب كورس ⚠️',
      message: `تم رفض كورس "${course.title}". السبب: ${reason}`,
      type: 'System',
      priority: 'High',
      isRead: false,
    });
  }

  res.status(200).json(new ApiResponse(200, null, 'تم تسجيل رفض الكورس وإبلاغ المحاضر بالسبب'));
});

/**
 * Toggle feature badge for course.
 */
export const featureCourseAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.isFeatured = !course.isFeatured;
  await course.save();

  res.status(200).json(
    new ApiResponse(
      200,
      course,
      course.isFeatured ? 'تم تمييز الكورس كمحتوى متميز 🌟' : 'تم إزالة التمييز عن الكورس'
    )
  );
});

/**
 * Publish / Unpublish / Archive course status.
 */
export const changeCourseStatusAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['Draft', 'Published', 'Archived'].includes(status)) {
    throw new ApiError(400, 'حالة الكورس غير صالحة');
  }

  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.status = status;
  await course.save();

  res.status(200).json(new ApiResponse(200, course, `تم تغيير حالة الكورس إلى ${status}`));
});

/**
 * Soft delete course.
 */
export const softDeleteCourseAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.status = 'Archived';
  await course.save();

  res.status(200).json(new ApiResponse(200, null, 'تم أرشفة ونقل الكورس للمحذوفات بنجاح'));
});
