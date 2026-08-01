import { Request, Response } from 'express';
import { Enrollment } from './enrollment.model';
import { Course } from '../courses/course.model';
import { Notification } from '../notifications/notification.model';
import { emitToUser } from '../../config/socket';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Enroll a student in a course.
 */
export const enrollStudent = catchAsync(async (req: Request, res: Response) => {
  const { courseId, paymentStatus } = req.body;
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Strict Role Check: Only students can enroll in courses
  if (req.user?.role !== 'STUDENT') {
    throw new ApiError(400, 'حسابك مسجل كمعلم/إدارة — لا يمكن للمدرس أو المدير الاشتراك في الكورسات كطالب. يمكنك استخدام وضع المعاينة بدلاً من ذلك.');
  }

  // 1. Check if course exists and is published
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (course.status !== 'Published') {
    throw new ApiError(400, 'Cannot enroll in a course that is not published');
  }

  // 2. Check for duplicate enrollment
  const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
  if (existingEnrollment) {
    throw new ApiError(400, 'You are already enrolled in this course');
  }

  // 3. Set payment properties
  let finalPaymentStatus = paymentStatus || 'Paid'; // Default to Paid for testing simulation
  if (course.isFree) {
    finalPaymentStatus = 'Free';
  }

  const purchasePrice = course.discountPrice !== undefined && course.discountPrice > 0 
    ? course.discountPrice 
    : course.price;

  const status = finalPaymentStatus === 'Unpaid' ? 'Pending' : 'Active';

  // 4. Create enrollment record
  const enrollment = await Enrollment.create({
    studentId,
    courseId,
    teacherId: course.teacher,
    status,
    paymentStatus: finalPaymentStatus,
    purchasePrice,
    enrolledAt: new Date(),
  });

  // 5. Increment course enrollment count
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  // 6. Send automatic notifications to Student and Teacher
  try {
    const studentName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || 'الطالب';

    // Notification to Student
    const studentNotif = await Notification.create({
      recipientId: studentId,
      title: 'تم تسجيلك بنجاح في الكورس 🎓',
      message: `مرحباً بك في كورس "${course.title}". يمكنك الآن البدء في متابعة الدروس والاختبارات.`,
      type: 'Course',
      priority: 'High',
      deliveryChannel: ['InApp'],
      isRead: false,
    });
    emitToUser(studentId, 'notification', studentNotif);

    // Notification to Teacher (if present)
    if (course.teacher) {
      const teacherNotif = await Notification.create({
        recipientId: course.teacher,
        title: 'انضمام طالب جديد إلى كورس 👨‍🎓',
        message: `قام الطالب "${studentName}" بالاشتراك في كورس "${course.title}".`,
        type: 'Course',
        priority: 'Medium',
        deliveryChannel: ['InApp'],
        isRead: false,
      });
      emitToUser(course.teacher, 'notification', teacherNotif);
    }
  } catch {
    // Non-critical — don't break enrollment flow if notification fails
  }

  res.status(201).json(new ApiResponse(201, enrollment, 'Enrolled successfully'));
});

/**
 * Cancel a student enrollment.
 */
export const cancelEnrollment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findById(id);

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  if (enrollment.status === 'Cancelled') {
    throw new ApiError(400, 'Enrollment is already cancelled');
  }

  enrollment.status = 'Cancelled';
  await enrollment.save();

  // Decrement course enrollment count
  await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { enrollmentCount: -1 } });

  res.status(200).json(new ApiResponse(200, enrollment, 'Enrollment cancelled successfully'));
});

/**
 * Manually mark enrollment as completed.
 */
export const completeCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findById(id);

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  if (enrollment.status === 'Completed') {
    throw new ApiError(400, 'Course is already completed');
  }

  enrollment.status = 'Completed';
  enrollment.completedAt = new Date();
  enrollment.certificateIssued = true;
  await enrollment.save();

  res.status(200).json(new ApiResponse(200, enrollment, 'Course completed successfully'));
});

/**
 * Get courses enrolled by the logged in student with real DB lesson counts and watch progress.
 */
export const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user?._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter: any = { studentId };
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const rawEnrollments = await Enrollment.find(filter)
    .populate({
      path: 'courseId',
      populate: {
        path: 'subject',
        select: 'name slug color icon',
      },
    })
    .populate('teacherId', 'firstName lastName email avatar')
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const Lesson = (await import('../lessons/lesson.model')).Lesson;
  const Progress = (await import('../progress/progress.model')).Progress;

  const enrollments = await Promise.all(
    rawEnrollments.map(async (enrollment) => {
      const doc: any = enrollment.toObject();
      const courseObj = typeof doc.courseId === 'object' ? doc.courseId : null;

      if (courseObj && courseObj._id) {
        const totalLessons = await Lesson.countDocuments({ courseId: courseObj._id });
        const completedLessons = await Progress.countDocuments({
          studentId,
          courseId: courseObj._id,
          completed: true,
        });

        doc.totalLessons = totalLessons;
        doc.completedLessons = completedLessons;
        doc.progressPercentage =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : doc.status === 'Completed'
            ? 100
            : 0;

        courseObj.lessonCount = totalLessons;
      }
      return doc;
    })
  );

  const total = await Enrollment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        enrollments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Enrolled courses retrieved successfully'
    )
  );
});

/**
 * Get all enrollments (Admin and Teachers).
 */
export const getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, courseId, teacherId, studentId, status, paymentStatus } = req.query;
  const filter: any = {};

  if (courseId) filter.courseId = courseId;
  if (teacherId) filter.teacherId = teacherId;
  if (studentId) filter.studentId = studentId;
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  // Teachers can only view enrollments of their own courses
  if (req.user && req.user.role === 'TEACHER') {
    filter.teacherId = req.user._id;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const enrollments = await Enrollment.find(filter)
    .populate('studentId', 'firstName lastName username email avatar')
    .populate('courseId', 'title slug thumbnail')
    .populate('teacherId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Enrollment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        enrollments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'All enrollments retrieved successfully'
    )
  );
});
