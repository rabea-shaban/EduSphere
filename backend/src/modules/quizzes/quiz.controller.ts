import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Quiz } from './quiz.model';
import { Course } from '../courses/course.model';
import { ExamAttempt } from '../examAttempts/examAttempt.model';
import { ActivityLog } from '../activityLogs/activityLog.model';
import { Notification } from '../notifications/notification.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { User } from '../users/user.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function notifyStudentsAboutQuiz(quiz: any): Promise<void> {
  try {
    let studentIds: any[] = [];
    let courseTitle = 'المنصة التعليمية';

    if (quiz.courseId) {
      const course = await Course.findById(quiz.courseId).select('title').lean();
      if (course) courseTitle = course.title;

      const enrollments = await Enrollment.find({ courseId: quiz.courseId, status: { $ne: 'Cancelled' } })
        .select('studentId')
        .lean();
      studentIds = enrollments.map((e: any) => e.studentId).filter(Boolean);
    }

    if (studentIds.length === 0) {
      const students = await User.find({ role: 'STUDENT', isDeleted: { $ne: true } })
        .select('_id')
        .limit(300)
        .lean();
      studentIds = students.map((s: any) => s._id);
    }

    const durationText = quiz.duration > 0 ? `${quiz.duration} دقيقة` : 'بدون حد زمني';
    const notifTitle = `⚡ اختبار تقييمي جديد: ${quiz.title}`;
    const notifMsg = `تم نشر اختبار جديد في كورس (${courseTitle}). مدة الإنجاز: ${durationText} | نسبة النجاح المطلوب: ${quiz.passingPercentage || 60}%.`;

    const notificationsToCreate = studentIds.map((studentId) => ({
      recipientId: studentId,
      title: notifTitle,
      message: notifMsg,
      type: 'Quiz',
      priority: 'High',
      deliveryChannel: ['InApp'],
      isRead: false,
    }));

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate, { ordered: false }).catch(() => {});
    }
  } catch (err) {
    console.error('Failed to dispatch quiz notifications:', err);
  }
}

async function assertCourseOwnership(
  courseId: string,
  userId: string,
  userRole: string
): Promise<any> {
  const course = await Course.findById(new mongoose.Types.ObjectId(courseId)).select('teacher title');
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const isStudent = userRole === 'STUDENT';
  if (isStudent) {
    return course;
  }

  if (!isAdmin && course.teacher.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      'Access denied. You can only manage quizzes in your own courses.'
    );
  }

  return course;
}

async function assertQuizOwnership(
  quizId: string,
  userId: string,
  userRole: string
): Promise<any> {
  const quiz = await (Quiz.findById(new mongoose.Types.ObjectId(quizId)) as any).setOptions({
    withDeleted: true,
  });
  if (!quiz || (userRole === 'STUDENT' && quiz.isDeleted)) {
    throw new ApiError(404, 'Quiz not found');
  }

  if (userRole === 'STUDENT') {
    if (quiz.status !== 'Published') {
      throw new ApiError(403, 'Quiz is not available yet.');
    }
    return quiz;
  }

  if (quiz.courseId) {
    await assertCourseOwnership(quiz.courseId.toString(), userId, userRole);
  }

  return quiz;
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
    module: 'Quizzes',
    status: 'SUCCESS',
    details,
  }).catch(() => {});
}

// ─── Quiz Controllers ────────────────────────────────────────────────────────

/**
 * GET /teacher/quizzes
 * Search & filter quizzes belonging to the teacher.
 */
export const getTeacherQuizzes = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 50, search, courseId, lessonId, status, sort } = req.query;
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  // Filter quizzes by role
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
    }).select('_id').lean();
    const courseIds = teacherCourses.map((c: any) => c._id);

    courseFilter.$or = [
      { courseId: { $in: courseIds } },
      { createdBy: userId },
      { teacherId: userId },
    ];
  }

  if (courseId) courseFilter.courseId = courseId;
  if (lessonId) courseFilter.lessonId = lessonId;
  if (status && userRole !== 'STUDENT') courseFilter.status = status;

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

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .populate('courseId', 'title slug')
      .populate('lessonId', 'title')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Quiz.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        quizzes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Quizzes retrieved successfully'
    )
  );
});

/**
 * GET /teacher/quizzes/:id
 * Get single quiz by ID.
 */
export const getQuizById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz retrieved successfully'));
});

/**
 * POST /teacher/quizzes
 * Create a new quiz.
 */
export const createQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  if (req.body.courseId) {
    await assertCourseOwnership(req.body.courseId, userId, userRole);
  }

  const quiz = await Quiz.create(req.body);

  if (quiz.status === 'Published') {
    notifyStudentsAboutQuiz(quiz).catch(() => {});
  }

  await logActivity(userId, userName, userRole, 'QUIZ_CREATED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
    courseId: quiz.courseId,
  });

  res.status(201).json(new ApiResponse(201, quiz, 'Quiz created successfully'));
});

/**
 * PUT/PATCH /teacher/quizzes/:id
 * Update quiz settings.
 */
export const updateQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  if (req.body.courseId && req.body.courseId !== quiz.courseId?.toString()) {
    await assertCourseOwnership(req.body.courseId, userId, userRole);
  }

  Object.assign(quiz, req.body);
  await quiz.save();

  await logActivity(userId, userName, userRole, 'QUIZ_UPDATED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz updated successfully'));
});

/**
 * DELETE /teacher/quizzes/:id
 * Soft-delete quiz.
 */
export const deleteQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  quiz.isDeleted = true;
  quiz.deletedAt = new Date();
  await quiz.save({ validateBeforeSave: false });

  await logActivity(userId, userName, userRole, 'QUIZ_DELETED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, null, 'Quiz deleted successfully'));
});

/**
 * PATCH /teacher/quizzes/:id/publish
 */
export const publishQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  quiz.status = 'Published';
  await quiz.save();

  notifyStudentsAboutQuiz(quiz).catch(() => {});

  await logActivity(userId, userName, userRole, 'QUIZ_PUBLISHED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz published successfully'));
});

/**
 * PATCH /teacher/quizzes/:id/unpublish
 */
export const unpublishQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  quiz.status = 'Draft';
  await quiz.save();

  await logActivity(userId, userName, userRole, 'QUIZ_UNPUBLISHED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz unpublished successfully'));
});

/**
 * PATCH /teacher/quizzes/:id/archive
 */
export const archiveQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  quiz.status = 'Archived';
  await quiz.save();

  await logActivity(userId, userName, userRole, 'QUIZ_ARCHIVED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz archived successfully'));
});

/**
 * PATCH /teacher/quizzes/:id/restore
 */
export const restoreQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  quiz.isDeleted = false;
  quiz.deletedAt = undefined;
  quiz.status = 'Draft';
  await quiz.save({ validateBeforeSave: false });

  await logActivity(userId, userName, userRole, 'QUIZ_RESTORED', {
    quizId: quiz._id,
    quizTitle: quiz.title,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz restored successfully'));
});

/**
 * POST /teacher/quizzes/:id/duplicate
 */
export const duplicateQuiz = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const sourceQuiz = await assertQuizOwnership(id, userId, userRole);

  const clonedData = sourceQuiz.toObject() as any;
  delete clonedData._id;
  delete clonedData.createdAt;
  delete clonedData.updatedAt;
  delete clonedData.__v;

  clonedData.title = `${sourceQuiz.title} - نسخة`;
  clonedData.status = 'Draft';
  clonedData.isDeleted = false;
  delete clonedData.deletedAt;

  const duplicatedQuiz = await Quiz.create(clonedData);

  await logActivity(userId, userName, userRole, 'QUIZ_DUPLICATED', {
    sourceQuizId: id,
    duplicatedQuizId: duplicatedQuiz._id,
  });

  res.status(201).json(new ApiResponse(201, duplicatedQuiz, 'Quiz duplicated successfully'));
});

// ─── Question CRUD Controllers ────────────────────────────────────────────────

/**
 * GET /teacher/quizzes/:id/questions
 */
export const getQuizQuestions = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  res.status(200).json(new ApiResponse(200, quiz.questions || [], 'Questions retrieved successfully'));
});

/**
 * POST /teacher/quizzes/:id/questions
 * Add question to quiz.
 */
export const addQuizQuestion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  const newOrder = req.body.order || (quiz.questions?.length ? quiz.questions.length + 1 : 1);
  const newQuestion = { ...req.body, order: newOrder };

  quiz.questions = quiz.questions || [];
  quiz.questions.push(newQuestion);
  await quiz.save();

  const createdQuestion = quiz.questions[quiz.questions.length - 1];

  await logActivity(userId, userName, userRole, 'QUESTION_ADDED', {
    quizId: quiz._id,
    questionId: createdQuestion._id,
  });

  res.status(201).json(new ApiResponse(201, quiz, 'Question added successfully'));
});

/**
 * PUT /teacher/questions/:id  (or /teacher/quizzes/:quizId/questions/:id)
 * Update a question inside quiz.
 */
export const updateQuizQuestion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const questionId = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await Quiz.findOne({ 'questions._id': questionId } as any);
  if (!quiz) {
    throw new ApiError(404, 'Question not found');
  }

  if (quiz.courseId) {
    await assertCourseOwnership(quiz.courseId.toString(), userId, userRole);
  }

  const qIndex = quiz.questions!.findIndex((q: any) => q._id.toString() === questionId);
  if (qIndex === -1) {
    throw new ApiError(404, 'Question not found in quiz');
  }

  Object.assign(quiz.questions![qIndex], req.body);
  await quiz.save();

  await logActivity(userId, userName, userRole, 'QUESTION_UPDATED', {
    quizId: quiz._id,
    questionId,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Question updated successfully'));
});

/**
 * DELETE /teacher/questions/:id
 */
export const deleteQuizQuestion = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const questionId = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;
  const userName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;

  const quiz = await Quiz.findOne({ 'questions._id': questionId } as any);
  if (!quiz) {
    throw new ApiError(404, 'Question not found');
  }

  if (quiz.courseId) {
    await assertCourseOwnership(quiz.courseId.toString(), userId, userRole);
  }

  quiz.questions = quiz.questions!.filter((q: any) => q._id.toString() !== questionId);
  await quiz.save();

  await logActivity(userId, userName, userRole, 'QUESTION_DELETED', {
    quizId: quiz._id,
    questionId,
  });

  res.status(200).json(new ApiResponse(200, quiz, 'Question deleted successfully'));
});

/**
 * PATCH /teacher/questions/reorder
 */
export const reorderQuizQuestions = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { quizId, items } = req.body as { quizId: string; items: { id: string; order: number }[] };
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const quiz = await assertQuizOwnership(quizId, userId, userRole);

  const orderMap = new Map(items.map((i) => [i.id, i.order]));
  quiz.questions?.forEach((q: any) => {
    if (orderMap.has(q._id.toString())) {
      q.order = orderMap.get(q._id.toString());
    }
  });

  quiz.questions?.sort((a: any, b: any) => a.order - b.order);
  await quiz.save();

  res.status(200).json(new ApiResponse(200, quiz, 'Questions reordered successfully'));
});

// ─── Analytics & Leaderboard Controllers ──────────────────────────────────────

/**
 * GET /teacher/quizzes/:id/analytics
 * Comprehensive Quiz Analytics (average score, pass rate, failure rate, difficulty, etc.)
 */
export const getQuizAnalytics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const userId = req.user!._id.toString();
  const userRole = req.user!.role;

  const quiz = await assertQuizOwnership(id, userId, userRole);

  const attempts = await ExamAttempt.find({
    quizId: id,
    status: { $in: ['Submitted', 'Graded'] },
  }).lean();

  const attemptsCount = attempts.length;
  let averageScore = 0;
  let highestScore = 0;
  let lowestScore = 0;
  let passCount = 0;
  let failCount = 0;
  let totalTimeTaken = 0;

  if (attemptsCount > 0) {
    let totalScore = 0;
    lowestScore = attempts[0].score || 0;

    attempts.forEach((a) => {
      const score = a.score || 0;
      totalScore += score;
      if (score > highestScore) highestScore = score;
      if (score < lowestScore) lowestScore = score;
      if (a.passed) passCount++;
      else failCount++;

      const start = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const end = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      if (start && end) totalTimeTaken += Math.round((end - start) / 1000);
    });

    averageScore = Math.round((totalScore / attemptsCount) * 10) / 10;
  }

  const passRate = attemptsCount > 0 ? Math.round((passCount / attemptsCount) * 100) : 0;
  const failureRate = attemptsCount > 0 ? Math.round((failCount / attemptsCount) * 100) : 0;
  const averageCompletionTimeSeconds = attemptsCount > 0 ? Math.round(totalTimeTaken / attemptsCount) : 0;

  const analytics = {
    quizId: quiz._id,
    quizTitle: quiz.title,
    totalQuestions: quiz.totalQuestions || quiz.questions?.length || 0,
    totalMarks: quiz.totalMarks || 0,
    attemptsCount,
    averageScore,
    highestScore,
    lowestScore,
    passCount,
    failCount,
    passRate,
    failureRate,
    completionRate: attemptsCount > 0 ? 100 : 0,
    averageCompletionTimeSeconds,
  };

  res.status(200).json(new ApiResponse(200, analytics, 'Quiz analytics generated successfully'));
});

/**
 * GET /teacher/quizzes/:id/leaderboard
 */
export const getQuizLeaderboard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  const attempts = await ExamAttempt.find({
    quizId: id,
    status: { $in: ['Submitted', 'Graded'] },
  })
    .populate('studentId', 'firstName lastName username avatar')
    .lean();

  const rankedList = attempts
    .map((attempt) => {
      const start = attempt.startedAt ? new Date(attempt.startedAt).getTime() : 0;
      const end = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : 0;
      const timeTaken = start && end ? Math.round((end - start) / 1000) : 0;

      return {
        student: attempt.studentId,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken,
        passed: attempt.passed,
      };
    })
    .sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return a.timeTaken - b.timeTaken;
    });

  const leaderboard = rankedList.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));

  res.status(200).json(new ApiResponse(200, leaderboard, 'Quiz leaderboard retrieved successfully'));
});
