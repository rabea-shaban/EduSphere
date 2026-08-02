"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizLeaderboard = exports.getQuizAnalytics = exports.reorderQuizQuestions = exports.deleteQuizQuestion = exports.updateQuizQuestion = exports.addQuizQuestion = exports.getQuizQuestions = exports.duplicateQuiz = exports.restoreQuiz = exports.archiveQuiz = exports.unpublishQuiz = exports.publishQuiz = exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.getQuizById = exports.getTeacherQuizzes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const quiz_model_1 = require("./quiz.model");
const course_model_1 = require("../courses/course.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const notification_model_1 = require("../notifications/notification.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const user_model_1 = require("../users/user.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
async function notifyStudentsAboutQuiz(quiz) {
    try {
        let studentIds = [];
        let courseTitle = 'المنصة التعليمية';
        if (quiz.courseId) {
            const course = await course_model_1.Course.findById(quiz.courseId).select('title').lean();
            if (course)
                courseTitle = course.title;
            const enrollments = await enrollment_model_1.Enrollment.find({ courseId: quiz.courseId, status: { $ne: 'Cancelled' } })
                .select('studentId')
                .lean();
            studentIds = enrollments.map((e) => e.studentId).filter(Boolean);
        }
        if (studentIds.length === 0) {
            const students = await user_model_1.User.find({ role: 'STUDENT', isDeleted: { $ne: true } })
                .select('_id')
                .limit(300)
                .lean();
            studentIds = students.map((s) => s._id);
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
            await notification_model_1.Notification.insertMany(notificationsToCreate, { ordered: false }).catch(() => { });
        }
    }
    catch (err) {
        console.error('Failed to dispatch quiz notifications:', err);
    }
}
async function assertCourseOwnership(courseId, userId, userRole) {
    const course = await course_model_1.Course.findById(new mongoose_1.default.Types.ObjectId(courseId)).select('teacher instructor createdBy title');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    const roleUpper = String(userRole || '').toUpperCase();
    const isAdmin = roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN';
    const isStudent = roleUpper === 'STUDENT';
    if (isStudent) {
        return course;
    }
    const teacherIdStr = course.teacher?.toString() || course.instructor?.toString() || course.createdBy?.toString();
    if (!isAdmin && teacherIdStr && teacherIdStr !== userId.toString()) {
        throw new ApiError_1.ApiError(403, 'Access denied. You can only manage quizzes in your own courses.');
    }
    return course;
}
async function assertQuizOwnership(quizId, userId, userRole) {
    const quiz = await quiz_model_1.Quiz.findById(new mongoose_1.default.Types.ObjectId(quizId)).setOptions({
        withDeleted: true,
    });
    const roleUpper = String(userRole || '').toUpperCase();
    if (!quiz || (roleUpper === 'STUDENT' && quiz.isDeleted)) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    if (roleUpper === 'STUDENT') {
        return quiz;
    }
    if (quiz.courseId) {
        await assertCourseOwnership(quiz.courseId.toString(), userId, roleUpper);
    }
    return quiz;
}
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Course',
        module: 'Quizzes',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Quiz Controllers ────────────────────────────────────────────────────────
/**
 * GET /teacher/quizzes
 * Search & filter quizzes belonging to the teacher.
 */
exports.getTeacherQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, courseId, lessonId, status, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    // Filter quizzes by role
    const courseFilter = { isDeleted: { $ne: true } };
    if (userRole === 'STUDENT') {
        courseFilter.status = 'Published';
        const studentEnrollments = await enrollment_model_1.Enrollment.find({ studentId: userId, status: { $ne: 'Cancelled' } }).select('courseId').lean();
        const enrolledCourseIds = studentEnrollments.map((e) => e.courseId).filter(Boolean);
        if (enrolledCourseIds.length > 0) {
            courseFilter.$or = [
                { courseId: { $in: enrolledCourseIds } },
                { courseId: { $exists: false } },
                { courseId: null },
            ];
        }
        else {
            courseFilter.$or = [{ courseId: { $exists: false } }, { courseId: null }];
        }
    }
    else if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        const teacherCourses = await course_model_1.Course.find({
            $or: [{ teacher: userId }, { instructor: userId }, { createdBy: userId }],
        }).select('_id').lean();
        const courseIds = teacherCourses.map((c) => c._id);
        courseFilter.$or = [
            { courseId: { $in: courseIds } },
            { createdBy: userId },
            { teacherId: userId },
            { courseId: { $exists: false } },
            { courseId: null },
        ];
    }
    if (courseId)
        courseFilter.courseId = courseId;
    if (lessonId)
        courseFilter.lessonId = lessonId;
    if (status && userRole !== 'STUDENT')
        courseFilter.status = status;
    const filter = { ...courseFilter };
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    let sortBy = { createdAt: -1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const [quizzes, total] = await Promise.all([
        quiz_model_1.Quiz.find(filter)
            .populate('courseId', 'title slug')
            .populate('lessonId', 'title')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        quiz_model_1.Quiz.countDocuments(filter),
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        quizzes,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Quizzes retrieved successfully'));
});
/**
 * GET /teacher/quizzes/:id
 * Get single quiz by ID.
 */
exports.getQuizById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz retrieved successfully'));
});
/**
 * POST /teacher/quizzes
 * Create a new quiz.
 */
exports.createQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    if (req.body.courseId) {
        await assertCourseOwnership(req.body.courseId, userId, userRole);
    }
    const quizPayload = {
        ...req.body,
        createdBy: userId,
        teacherId: userId,
    };
    const quiz = await quiz_model_1.Quiz.create(quizPayload);
    if (quiz.status === 'Published') {
        notifyStudentsAboutQuiz(quiz).catch(() => { });
    }
    await logActivity(userId, userName, userRole, 'QUIZ_CREATED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
        courseId: quiz.courseId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, quiz, 'Quiz created successfully'));
});
/**
 * PUT/PATCH /teacher/quizzes/:id
 * Update quiz settings.
 */
exports.updateQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz updated successfully'));
});
/**
 * DELETE /teacher/quizzes/:id
 * Soft-delete quiz.
 */
exports.deleteQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    quiz.isDeleted = true;
    quiz.deletedAt = new Date();
    await quiz.save({ validateBeforeSave: false });
    await logActivity(userId, userName, userRole, 'QUIZ_DELETED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Quiz deleted successfully'));
});
/**
 * PATCH /teacher/quizzes/:id/publish
 */
exports.publishQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    quiz.status = 'Published';
    await quiz.save();
    notifyStudentsAboutQuiz(quiz).catch(() => { });
    await logActivity(userId, userName, userRole, 'QUIZ_PUBLISHED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz published successfully'));
});
/**
 * PATCH /teacher/quizzes/:id/unpublish
 */
exports.unpublishQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    quiz.status = 'Draft';
    await quiz.save();
    await logActivity(userId, userName, userRole, 'QUIZ_UNPUBLISHED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz unpublished successfully'));
});
/**
 * PATCH /teacher/quizzes/:id/archive
 */
exports.archiveQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    quiz.status = 'Archived';
    await quiz.save();
    await logActivity(userId, userName, userRole, 'QUIZ_ARCHIVED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz archived successfully'));
});
/**
 * PATCH /teacher/quizzes/:id/restore
 */
exports.restoreQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    quiz.isDeleted = false;
    quiz.deletedAt = undefined;
    quiz.status = 'Draft';
    await quiz.save({ validateBeforeSave: false });
    await logActivity(userId, userName, userRole, 'QUIZ_RESTORED', {
        quizId: quiz._id,
        quizTitle: quiz.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz restored successfully'));
});
/**
 * POST /teacher/quizzes/:id/duplicate
 */
exports.duplicateQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const sourceQuiz = await assertQuizOwnership(id, userId, userRole);
    const clonedData = sourceQuiz.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.__v;
    clonedData.title = `${sourceQuiz.title} - نسخة`;
    clonedData.status = 'Draft';
    clonedData.isDeleted = false;
    delete clonedData.deletedAt;
    const duplicatedQuiz = await quiz_model_1.Quiz.create(clonedData);
    await logActivity(userId, userName, userRole, 'QUIZ_DUPLICATED', {
        sourceQuizId: id,
        duplicatedQuizId: duplicatedQuiz._id,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, duplicatedQuiz, 'Quiz duplicated successfully'));
});
// ─── Question CRUD Controllers ────────────────────────────────────────────────
/**
 * GET /teacher/quizzes/:id/questions
 */
exports.getQuizQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz.questions || [], 'Questions retrieved successfully'));
});
/**
 * POST /teacher/quizzes/:id/questions
 * Add question to quiz.
 */
exports.addQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
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
    res.status(201).json(new ApiResponse_1.ApiResponse(201, quiz, 'Question added successfully'));
});
/**
 * PUT /teacher/questions/:id  (or /teacher/quizzes/:quizId/questions/:id)
 * Update a question inside quiz.
 */
exports.updateQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const questionId = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await quiz_model_1.Quiz.findOne({ 'questions._id': questionId });
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Question not found');
    }
    if (quiz.courseId) {
        await assertCourseOwnership(quiz.courseId.toString(), userId, userRole);
    }
    const qIndex = quiz.questions.findIndex((q) => q._id.toString() === questionId);
    if (qIndex === -1) {
        throw new ApiError_1.ApiError(404, 'Question not found in quiz');
    }
    Object.assign(quiz.questions[qIndex], req.body);
    await quiz.save();
    await logActivity(userId, userName, userRole, 'QUESTION_UPDATED', {
        quizId: quiz._id,
        questionId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Question updated successfully'));
});
/**
 * DELETE /teacher/questions/:id
 */
exports.deleteQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const questionId = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const quiz = await quiz_model_1.Quiz.findOne({ 'questions._id': questionId });
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Question not found');
    }
    if (quiz.courseId) {
        await assertCourseOwnership(quiz.courseId.toString(), userId, userRole);
    }
    quiz.questions = quiz.questions.filter((q) => q._id.toString() !== questionId);
    await quiz.save();
    await logActivity(userId, userName, userRole, 'QUESTION_DELETED', {
        quizId: quiz._id,
        questionId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Question deleted successfully'));
});
/**
 * PATCH /teacher/questions/reorder
 */
exports.reorderQuizQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId, items } = req.body;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const quiz = await assertQuizOwnership(quizId, userId, userRole);
    const orderMap = new Map(items.map((i) => [i.id, i.order]));
    quiz.questions?.forEach((q) => {
        if (orderMap.has(q._id.toString())) {
            q.order = orderMap.get(q._id.toString());
        }
    });
    quiz.questions?.sort((a, b) => a.order - b.order);
    await quiz.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Questions reordered successfully'));
});
// ─── Analytics & Leaderboard Controllers ──────────────────────────────────────
/**
 * GET /teacher/quizzes/:id/analytics
 * Comprehensive Quiz Analytics (average score, pass rate, failure rate, difficulty, etc.)
 */
exports.getQuizAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const quiz = await assertQuizOwnership(id, userId, userRole);
    const attempts = await examAttempt_model_1.ExamAttempt.find({
        quizId: id,
        status: { $in: ['Submitted', 'Graded'] },
    }).lean();
    const calculatedTotalMarks = (quiz.questions && quiz.questions.length > 0)
        ? quiz.questions.reduce((sum, q) => sum + (q.marks || 1), 0)
        : (quiz.totalMarks || 100);
    const attemptsCount = attempts.length;
    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = 0;
    let passCount = 0;
    let failCount = 0;
    let totalTimeTaken = 0;
    if (attemptsCount > 0) {
        let totalScore = 0;
        lowestScore = attempts[0].percentage ?? attempts[0].score ?? 0;
        attempts.forEach((a) => {
            const score = a.percentage ?? a.score ?? 0;
            totalScore += score;
            if (score > highestScore)
                highestScore = score;
            if (score < lowestScore)
                lowestScore = score;
            const isPassed = a.passed ?? (score >= (quiz.passingPercentage || 60));
            if (isPassed)
                passCount++;
            else
                failCount++;
            const start = a.startedAt ? new Date(a.startedAt).getTime() : 0;
            const end = a.submittedAt ? new Date(a.submittedAt).getTime() : (a.completedAt ? new Date(a.completedAt).getTime() : 0);
            const timeTaken = a.timeTakenSeconds || (start && end ? Math.round((end - start) / 1000) : 0);
            totalTimeTaken += timeTaken;
        });
        averageScore = Math.round((totalScore / attemptsCount) * 10) / 10;
    }
    const passRate = attemptsCount > 0 ? Math.round((passCount / attemptsCount) * 100) : 0;
    const failureRate = attemptsCount > 0 ? 100 - passRate : 0;
    const averageCompletionTimeSeconds = attemptsCount > 0 ? Math.round(totalTimeTaken / attemptsCount) : 0;
    const analytics = {
        quizId: quiz._id,
        quizTitle: quiz.title,
        totalQuestions: quiz.totalQuestions || quiz.questions?.length || 0,
        totalMarks: calculatedTotalMarks,
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, analytics, 'Quiz analytics generated successfully'));
});
/**
 * GET /teacher/quizzes/:id/leaderboard
 */
exports.getQuizLeaderboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quiz = await quiz_model_1.Quiz.findById(id);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    const attempts = await examAttempt_model_1.ExamAttempt.find({
        quizId: id,
        status: { $in: ['Submitted', 'Graded'] },
    })
        .populate('studentId', 'firstName lastName username avatar')
        .lean();
    const rankedList = attempts
        .map((attempt) => {
        const start = attempt.startedAt ? new Date(attempt.startedAt).getTime() : 0;
        const end = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : 0;
        const timeTaken = attempt.timeTakenSeconds || (start && end ? Math.round((end - start) / 1000) : 0);
        return {
            student: attempt.studentId,
            score: attempt.score,
            percentage: attempt.percentage ?? attempt.score ?? 0,
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, leaderboard, 'Quiz leaderboard retrieved successfully'));
});
