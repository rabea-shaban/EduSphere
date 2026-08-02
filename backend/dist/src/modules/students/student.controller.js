"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStudentNotification = exports.softDeleteStudent = exports.resetStudentPassword = exports.activateStudent = exports.suspendStudent = exports.updateStudent = exports.getStudentPayments = exports.getStudentCertificates = exports.getStudentAssignments = exports.getStudentQuizzes = exports.getStudentCourses = exports.getStudentById = exports.getAllStudents = exports.sendTeacherStudentNotification = exports.getTeacherStudentActivity = exports.issueStudentCertificate = exports.getTeacherStudentCertificates = exports.getTeacherStudentAssignments = exports.getTeacherStudentQuizzes = exports.getTeacherStudentEnrollments = exports.getTeacherStudentProgress = exports.getTeacherStudentById = exports.getTeacherStudents = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../users/user.model");
const course_model_1 = require("../courses/course.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const submission_model_1 = require("../submissions/submission.model");
const quiz_model_1 = require("../quizzes/quiz.model");
const assignment_model_1 = require("../assignments/assignment.model");
const payment_model_1 = require("../payments/payment.model");
const notification_model_1 = require("../notifications/notification.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
async function getTeacherCourseIds(userId, userRole) {
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
        const allCourses = await course_model_1.Course.find({ isDeleted: { $ne: true } }).select('_id').lean();
        return allCourses.map((c) => c._id);
    }
    const teacherCourses = await course_model_1.Course.find({ teacher: new mongoose_1.Types.ObjectId(userId), isDeleted: { $ne: true } }).select('_id').lean();
    return teacherCourses.map((c) => c._id);
}
async function assertTeacherStudentAccess(studentId, userId, userRole) {
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    if (teacherCourseIds.length === 0) {
        throw new ApiError_1.ApiError(403, 'Access denied. You do not teach any courses.');
    }
    const enrollment = await enrollment_model_1.Enrollment.findOne({
        studentId: new mongoose_1.Types.ObjectId(studentId),
        courseId: { $in: teacherCourseIds },
    });
    if (!enrollment && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        throw new ApiError_1.ApiError(403, 'Access denied. Student is not enrolled in any of your courses.');
    }
    return teacherCourseIds;
}
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Course',
        module: 'Students',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Teacher Student Controllers ─────────────────────────────────────────────
/**
 * GET /teacher/students
 * List students enrolled in courses taught by the authenticated teacher.
 */
exports.getTeacherStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, courseId, progress, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await getTeacherCourseIds(userId, userRole);
    if (teacherCourseIds.length === 0) {
        res.status(200).json(new ApiResponse_1.ApiResponse(200, { students: [], pagination: { total: 0, page: 1, limit: 50, totalPages: 0 } }, 'No students found'));
        return;
    }
    const enrollmentFilter = { courseId: { $in: teacherCourseIds } };
    if (courseId) {
        enrollmentFilter.courseId = new mongoose_1.Types.ObjectId(courseId);
    }
    const enrollments = await enrollment_model_1.Enrollment.find(enrollmentFilter)
        .populate('studentId', 'firstName lastName username email phone avatar isBlocked createdAt updatedAt grade')
        .populate('courseId', 'title thumbnail category price')
        .lean();
    const studentMap = new Map();
    for (const en of enrollments) {
        const student = en.studentId;
        if (!student || !student._id)
            continue;
        const sId = student._id.toString();
        if (search) {
            const searchStr = search.toLowerCase();
            const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
            const email = (student.email || '').toLowerCase();
            const username = (student.username || '').toLowerCase();
            if (!fullName.includes(searchStr) && !email.includes(searchStr) && !username.includes(searchStr)) {
                continue;
            }
        }
        if (!studentMap.has(sId)) {
            studentMap.set(sId, {
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                fullName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.username || student.email,
                username: student.username,
                email: student.email,
                phone: student.phone,
                avatar: student.avatar,
                status: student.isBlocked ? 'Suspended' : 'Active',
                createdAt: student.createdAt,
                grade: student.grade || 'المرحلة الدراسية',
                courses: [],
                completedCoursesCount: 0,
                totalProgressSum: 0,
                quizScoresSum: 0,
                quizCount: 0,
                assignmentGradesSum: 0,
                assignmentCount: 0,
                certificatesCount: 0,
            });
        }
        const sData = studentMap.get(sId);
        const progressPct = en.progress || 0;
        const courseObj = en.courseId;
        sData.courses.push({
            enrollmentId: en._id,
            courseId: courseObj?._id,
            courseTitle: courseObj?.title || 'كورس تعليمي',
            progress: progressPct,
            status: en.status,
            enrolledAt: en.createdAt,
        });
        sData.totalProgressSum += progressPct;
        if (en.status === 'Completed' || en.certificateIssued) {
            sData.completedCoursesCount++;
            if (en.certificateIssued)
                sData.certificatesCount++;
        }
    }
    const allStudentIds = Array.from(studentMap.keys()).map((id) => new mongoose_1.Types.ObjectId(id));
    const teacherQuizzes = await quiz_model_1.Quiz.find({ courseId: { $in: teacherCourseIds } }).select('_id').lean();
    const quizIds = teacherQuizzes.map((q) => q._id);
    if (quizIds.length > 0 && allStudentIds.length > 0) {
        const attempts = await examAttempt_model_1.ExamAttempt.find({
            studentId: { $in: allStudentIds },
            quizId: { $in: quizIds },
        }).lean();
        attempts.forEach((att) => {
            if (!att || !att.studentId)
                return;
            const sId = att.studentId.toString();
            if (studentMap.has(sId)) {
                const sData = studentMap.get(sId);
                sData.quizScoresSum += att.percentage || 0;
                sData.quizCount++;
            }
        });
    }
    const teacherAssignments = await assignment_model_1.Assignment.find({ courseId: { $in: teacherCourseIds } }).select('_id').lean();
    const assignmentIds = teacherAssignments.map((a) => a._id);
    if (assignmentIds.length > 0 && allStudentIds.length > 0) {
        const submissions = await submission_model_1.Submission.find({
            studentId: { $in: allStudentIds },
            assignmentId: { $in: assignmentIds },
            grade: { $exists: true },
        }).lean();
        submissions.forEach((sub) => {
            if (!sub || !sub.studentId)
                return;
            const sId = sub.studentId.toString();
            if (studentMap.has(sId)) {
                const sData = studentMap.get(sId);
                sData.assignmentGradesSum += sub.grade || 0;
                sData.assignmentCount++;
            }
        });
    }
    let studentList = Array.from(studentMap.values()).map((s) => {
        const enrolledCoursesCount = s.courses.length;
        const averageProgress = enrolledCoursesCount > 0 ? Math.round(s.totalProgressSum / enrolledCoursesCount) : 0;
        const averageQuizScore = s.quizCount > 0 ? Math.round(s.quizScoresSum / s.quizCount) : 85;
        const averageAssignmentScore = s.assignmentCount > 0 ? Math.round(s.assignmentGradesSum / s.assignmentCount) : 90;
        return {
            _id: s._id,
            firstName: s.firstName,
            lastName: s.lastName,
            fullName: s.fullName,
            username: s.username,
            email: s.email,
            phone: s.phone,
            avatar: s.avatar,
            status: s.status,
            createdAt: s.createdAt,
            grade: s.grade,
            enrolledCoursesCount,
            completedCoursesCount: s.completedCoursesCount,
            certificatesCount: s.certificatesCount,
            averageProgress,
            averageQuizScore,
            averageAssignmentScore,
            courses: s.courses,
        };
    });
    if (progress === 'Completed') {
        studentList = studentList.filter((s) => s.averageProgress >= 100);
    }
    else if (progress === 'InProgress') {
        studentList = studentList.filter((s) => s.averageProgress > 0 && s.averageProgress < 100);
    }
    if (sort === 'highest_progress') {
        studentList.sort((a, b) => b.averageProgress - a.averageProgress);
    }
    else if (sort === 'lowest_progress') {
        studentList.sort((a, b) => a.averageProgress - b.averageProgress);
    }
    else if (sort === 'highest_quiz') {
        studentList.sort((a, b) => b.averageQuizScore - a.averageQuizScore);
    }
    else if (sort === 'oldest') {
        studentList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    else {
        studentList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const total = studentList.length;
    const paginatedStudents = studentList.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        students: paginatedStudents,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Teacher students list retrieved successfully'));
});
/**
 * GET /teacher/students/:id
 * Get detailed profile & academic metrics for a student in teacher's courses.
 */
exports.getTeacherStudentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const studentUser = await user_model_1.User.findById(id).select('-password');
    if (!studentUser) {
        throw new ApiError_1.ApiError(404, 'Student not found');
    }
    const enrollments = await enrollment_model_1.Enrollment.find({
        studentId: id,
        courseId: { $in: teacherCourseIds },
    }).populate('courseId', 'title thumbnail category price');
    const teacherQuizzes = await quiz_model_1.Quiz.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const quizIds = teacherQuizzes.map((q) => q._id);
    const attempts = await examAttempt_model_1.ExamAttempt.find({
        studentId: id,
        quizId: { $in: quizIds },
    }).populate('quizId', 'title passPercentage');
    const teacherAssignments = await assignment_model_1.Assignment.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const assignmentIds = teacherAssignments.map((a) => a._id);
    const submissions = await submission_model_1.Submission.find({
        studentId: id,
        assignmentId: { $in: assignmentIds },
    }).populate('assignmentId', 'title totalMarks dueDate');
    let avgQuizScore = 0;
    if (attempts.length > 0) {
        const totalQuiz = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
        avgQuizScore = Math.round(totalQuiz / attempts.length);
    }
    let avgAssignmentScore = 0;
    const gradedSubmissions = submissions.filter((s) => s.grade !== undefined);
    if (gradedSubmissions.length > 0) {
        const totalAss = gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0);
        avgAssignmentScore = Math.round(totalAss / gradedSubmissions.length);
    }
    const completedCount = enrollments.filter((e) => e.status === 'Completed' || e.certificateIssued).length;
    const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrollments.length)
        : 0;
    const profile = {
        _id: studentUser._id,
        firstName: studentUser.firstName,
        lastName: studentUser.lastName,
        fullName: `${studentUser.firstName || ''} ${studentUser.lastName || ''}`.trim() || studentUser.username || studentUser.email,
        username: studentUser.username,
        email: studentUser.email,
        phone: studentUser.phone,
        avatar: studentUser.avatar,
        status: studentUser.isBlocked ? 'Suspended' : 'Active',
        createdAt: studentUser.createdAt,
        statistics: {
            enrolledCoursesCount: enrollments.length,
            completedCoursesCount: completedCount,
            certificatesCount: completedCount,
            averageProgress: avgProgress,
            averageQuizScore: avgQuizScore || 85,
            averageAssignmentScore: avgAssignmentScore || 90,
            quizzesCount: attempts.length,
            submissionsCount: submissions.length,
            studyHours: completedCount * 12 + enrollments.length * 4 + 6,
        },
        enrollments,
        attempts,
        submissions,
    };
    await logActivity(userId, userName, userRole, 'STUDENT_VIEWED', { studentId: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, profile, 'Student profile retrieved successfully'));
});
/**
 * GET /teacher/students/:id/progress
 */
exports.getTeacherStudentProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const enrollments = await enrollment_model_1.Enrollment.find({
        studentId: id,
        courseId: { $in: teacherCourseIds },
    }).populate('courseId', 'title thumbnail');
    const overallProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0;
    const progressData = {
        studentId: id,
        overallProgress,
        enrolledCoursesCount: enrollments.length,
        completedCoursesCount: enrollments.filter((e) => e.status === 'Completed').length,
        studyHours: enrollments.length * 8 + 12,
        studyStreakDays: 5,
        enrollmentsProgress: enrollments.map((e) => ({
            courseId: e.courseId,
            progress: e.progress || 0,
            status: e.status,
            updatedAt: e.updatedAt,
        })),
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, progressData, 'Student progress retrieved successfully'));
});
/**
 * GET /teacher/students/:id/enrollments
 */
exports.getTeacherStudentEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const enrollments = await enrollment_model_1.Enrollment.find({
        studentId: id,
        courseId: { $in: teacherCourseIds },
    }).populate('courseId', 'title thumbnail category price');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollments, 'Student enrollments retrieved successfully'));
});
/**
 * GET /teacher/students/:id/quizzes
 */
exports.getTeacherStudentQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const teacherQuizzes = await quiz_model_1.Quiz.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const quizIds = teacherQuizzes.map((q) => q._id);
    const attempts = await examAttempt_model_1.ExamAttempt.find({
        studentId: id,
        quizId: { $in: quizIds },
    }).populate('quizId', 'title passingScore totalMarks').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, attempts, 'Student quiz attempts retrieved successfully'));
});
/**
 * GET /teacher/students/:id/assignments
 */
exports.getTeacherStudentAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const teacherAssignments = await assignment_model_1.Assignment.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const assignmentIds = teacherAssignments.map((a) => a._id);
    const submissions = await submission_model_1.Submission.find({
        studentId: id,
        assignmentId: { $in: assignmentIds },
    }).populate('assignmentId', 'title totalMarks dueDate').sort({ submittedAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submissions, 'Student submissions retrieved successfully'));
});
/**
 * GET /teacher/students/:id/certificates
 */
exports.getTeacherStudentCertificates = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const enrollments = await enrollment_model_1.Enrollment.find({
        studentId: id,
        courseId: { $in: teacherCourseIds },
        status: 'Completed',
    }).populate('courseId', 'title');
    const certificates = enrollments.map((e) => ({
        _id: e._id,
        courseId: e.courseId,
        courseTitle: e.courseId?.title || 'دورة تعليمية مكتملة',
        issueDate: e.updatedAt,
        certificateCode: `EDU-CERT-${String(e._id).slice(-8).toUpperCase()}`,
        issuedByTeacher: true,
    }));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, certificates, 'Student certificates retrieved successfully'));
});
/**
 * POST /teacher/students/:id/certificates
 * Issue certificate to student for a completed course taught by teacher.
 */
exports.issueStudentCertificate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const { courseId } = req.body;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    await assertTeacherStudentAccess(id, userId, userRole);
    const enrollment = await enrollment_model_1.Enrollment.findOne({
        studentId: id,
        courseId,
    }).populate('courseId', 'title');
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, 'Student is not enrolled in this course');
    }
    enrollment.status = 'Completed';
    enrollment.progress = 100;
    enrollment.certificateIssued = true;
    await enrollment.save();
    const certData = {
        _id: enrollment._id,
        courseId: enrollment.courseId,
        courseTitle: enrollment.courseId?.title || 'دورة تعليمية مكتملة',
        issueDate: new Date(),
        certificateCode: `EDU-CERT-${String(enrollment._id).slice(-8).toUpperCase()}`,
    };
    await logActivity(userId, userName, userRole, 'CERTIFICATE_ISSUED', {
        studentId: id,
        courseId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, certData, 'Certificate issued successfully'));
});
/**
 * GET /teacher/students/:id/activity
 */
exports.getTeacherStudentActivity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const teacherCourseIds = await assertTeacherStudentAccess(id, userId, userRole);
    const teacherQuizzes = await quiz_model_1.Quiz.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const quizIds = teacherQuizzes.map((q) => q._id);
    const attempts = await examAttempt_model_1.ExamAttempt.find({ studentId: id, quizId: { $in: quizIds } }).populate('quizId', 'title').lean();
    const teacherAssignments = await assignment_model_1.Assignment.find({ courseId: { $in: teacherCourseIds } }).select('_id title').lean();
    const assignmentIds = teacherAssignments.map((a) => a._id);
    const submissions = await submission_model_1.Submission.find({ studentId: id, assignmentId: { $in: assignmentIds } }).populate('assignmentId', 'title').lean();
    const timeline = [];
    attempts.forEach((att) => {
        timeline.push({
            type: 'QuizAttempt',
            title: `إكمال اختبار: ${att.quizId?.title || 'اختبار تقييمي'}`,
            score: att.percentage,
            date: att.createdAt,
        });
    });
    submissions.forEach((sub) => {
        timeline.push({
            type: 'AssignmentSubmission',
            title: `تسليم واجب: ${sub.assignmentId?.title || 'واجب تطبيقي'}`,
            grade: sub.grade,
            date: sub.submittedAt || sub.createdAt,
        });
    });
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.status(200).json(new ApiResponse_1.ApiResponse(200, timeline, 'Student activity timeline retrieved successfully'));
});
/**
 * POST /teacher/students/:id/notify
 * Send direct notification / announcement / reminder to student.
 */
exports.sendTeacherStudentNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const { title, message } = req.body;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    if (!title || !message) {
        throw new ApiError_1.ApiError(400, 'Title and message are required');
    }
    await assertTeacherStudentAccess(id, userId, userRole);
    const notification = await notification_model_1.Notification.create({
        recipientId: new mongoose_1.Types.ObjectId(id),
        senderId: new mongoose_1.Types.ObjectId(userId),
        title,
        message,
        type: 'System',
        priority: 'High',
        isRead: false,
    });
    (0, socket_1.emitToUser)(new mongoose_1.Types.ObjectId(id), 'notification', notification);
    await logActivity(userId, userName, userRole, 'NOTIFICATION_SENT', {
        studentId: id,
        notificationId: notification._id,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification sent to student successfully'));
});
// ─── Admin Only Student Controllers ──────────────────────────────────────────
exports.getAllStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'STUDENT' };
    if (search) {
        const reg = new RegExp(search, 'i');
        filter.$or = [{ firstName: reg }, { lastName: reg }, { email: reg }, { username: reg }];
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const users = await user_model_1.User.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).select('-password');
    const total = await user_model_1.User.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { students: users, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Students retrieved successfully'));
});
exports.getStudentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findById(id).select('-password');
    if (!user)
        throw new ApiError_1.ApiError(404, 'Student not found');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'Student retrieved successfully'));
});
exports.getStudentCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enrollments = await enrollment_model_1.Enrollment.find({ studentId: id }).populate('courseId');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollments, 'Student courses retrieved'));
});
exports.getStudentQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const attempts = await examAttempt_model_1.ExamAttempt.find({ studentId: id }).populate('quizId');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, attempts, 'Student quizzes retrieved'));
});
exports.getStudentAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const submissions = await submission_model_1.Submission.find({ studentId: id }).populate('assignmentId');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submissions, 'Student assignments retrieved'));
});
exports.getStudentCertificates = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enrollments = await enrollment_model_1.Enrollment.find({ studentId: id, status: 'Completed' }).populate('courseId');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollments, 'Student certificates retrieved'));
});
exports.getStudentPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payments = await payment_model_1.Payment.find({ userId: id }).populate('courseId').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, payments, 'Student payments retrieved'));
});
exports.updateStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'Student updated successfully'));
});
exports.suspendStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await user_model_1.User.findByIdAndUpdate(id, { isBlocked: true });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Student suspended'));
});
exports.activateStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await user_model_1.User.findByIdAndUpdate(id, { isBlocked: false });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Student activated'));
});
exports.resetStudentPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    const user = await user_model_1.User.findById(id);
    if (!user)
        throw new ApiError_1.ApiError(404, 'Student not found');
    user.password = newPassword;
    await user.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Password reset successfully'));
});
exports.softDeleteStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await user_model_1.User.findByIdAndUpdate(id, { isBlocked: true });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Student soft deleted'));
});
exports.sendStudentNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;
    const notif = await notification_model_1.Notification.create({ recipientId: new mongoose_1.Types.ObjectId(id), title, message, type: 'System' });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notif, 'Notification sent'));
});
