"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentAnalytics = exports.getAssignmentSubmissions = exports.duplicateAssignment = exports.restoreAssignment = exports.archiveAssignment = exports.unpublishAssignment = exports.publishAssignment = exports.deleteAssignment = exports.updateAssignment = exports.createAssignment = exports.getAssignmentById = exports.getTeacherAssignments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const assignment_model_1 = require("./assignment.model");
const course_model_1 = require("../courses/course.model");
const submission_model_1 = require("../submissions/submission.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const notification_model_1 = require("../notifications/notification.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
async function assertCourseOwnership(courseId, userId, userRole) {
    const course = await course_model_1.Course.findById(new mongoose_1.default.Types.ObjectId(courseId)).select('teacher title');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    const roleUpper = String(userRole || '').toUpperCase();
    const isAdmin = roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN';
    const isStudent = roleUpper === 'STUDENT';
    if (isStudent) {
        return course;
    }
    const courseTeacherId = course.teacher?.toString() || course.instructor?.toString() || course.createdBy?.toString();
    if (!isAdmin && courseTeacherId !== userId.toString()) {
        throw new ApiError_1.ApiError(403, 'Access denied. You can only manage assignments in your own courses.');
    }
    return course;
}
async function assertAssignmentOwnership(assignmentId, userId, userRole) {
    const assignment = await assignment_model_1.Assignment.findById(new mongoose_1.default.Types.ObjectId(assignmentId)).setOptions({
        withDeleted: true,
    });
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    const roleUpper = String(userRole || '').toUpperCase();
    if (roleUpper !== 'STUDENT' && assignment.courseId) {
        await assertCourseOwnership(assignment.courseId.toString(), userId, userRole);
    }
    return assignment;
}
async function notifyStudentsAboutAssignment(assignment) {
    try {
        if (!assignment || !assignment.courseId)
            return;
        const courseId = typeof assignment.courseId === 'object' ? assignment.courseId._id : assignment.courseId;
        const enrollments = await enrollment_model_1.Enrollment.find({ courseId, status: { $ne: 'Cancelled' } }).select('studentId').lean();
        const studentIds = enrollments.map((e) => e.studentId).filter(Boolean);
        if (studentIds.length === 0)
            return;
        const notifications = studentIds.map((studentId) => ({
            recipientId: studentId,
            title: `واجب جديد: "${assignment.title}"`,
            message: `تم نشر واجب جديد في كورسك الدراسي. موعد التسليم: ${assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('ar-EG') : 'متاح الآن'}.`,
            type: 'Assignment',
            priority: 'High',
            deliveryChannel: ['InApp'],
            isRead: false,
        }));
        await notification_model_1.Notification.insertMany(notifications);
    }
    catch (err) {
        console.error('Failed to dispatch assignment notifications:', err);
    }
}
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Course',
        module: 'Assignments',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Controller Handlers ─────────────────────────────────────────────────────
/**
 * GET /teacher/assignments
 * Get assignments with search & filters (supports Students & Teachers).
 */
exports.getTeacherAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, courseId, lessonId, status, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = String(req.user.role || '').toUpperCase();
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
            isDeleted: { $ne: true },
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
    if (status)
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
    const [assignments, total] = await Promise.all([
        assignment_model_1.Assignment.find(filter)
            .populate('courseId', 'title slug')
            .populate('lessonId', 'title')
            .populate('teacherId', 'firstName lastName email')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        assignment_model_1.Assignment.countDocuments(filter),
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        assignments,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Assignments retrieved successfully'));
});
/**
 * GET /teacher/assignments/:id
 */
exports.getAssignmentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment retrieved successfully'));
});
/**
 * POST /teacher/assignments
 */
exports.createAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    if (req.body.courseId) {
        await assertCourseOwnership(req.body.courseId, userId, userRole);
    }
    const payload = {
        ...req.body,
        teacherId: userId,
        unitId: req.body.sectionId || req.body.unitId,
    };
    const assignment = await assignment_model_1.Assignment.create(payload);
    if (assignment.status === 'Published') {
        notifyStudentsAboutAssignment(assignment).catch(() => { });
    }
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_CREATED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        courseId: assignment.courseId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, assignment, 'Assignment created successfully'));
});
/**
 * PUT/PATCH /teacher/assignments/:id
 */
exports.updateAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment updated successfully'));
});
/**
 * DELETE /teacher/assignments/:id (Soft Delete)
 */
exports.deleteAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    assignment.isDeleted = true;
    assignment.deletedAt = new Date();
    await assignment.save({ validateBeforeSave: false });
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_DELETED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Assignment deleted successfully'));
});
/**
 * PATCH /teacher/assignments/:id/publish
 */
exports.publishAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    assignment.status = 'Published';
    await assignment.save();
    notifyStudentsAboutAssignment(assignment).catch(() => { });
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_PUBLISHED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment published successfully'));
});
/**
 * PATCH /teacher/assignments/:id/unpublish
 */
exports.unpublishAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    assignment.status = 'Draft';
    await assignment.save();
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_UNPUBLISHED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment unpublished successfully'));
});
/**
 * PATCH /teacher/assignments/:id/archive
 */
exports.archiveAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    assignment.status = 'Archived';
    await assignment.save();
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_ARCHIVED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment archived successfully'));
});
/**
 * PATCH /teacher/assignments/:id/restore
 */
exports.restoreAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    assignment.isDeleted = false;
    assignment.deletedAt = null;
    assignment.status = 'Draft';
    await assignment.save({ validateBeforeSave: false });
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_RESTORED', {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment restored successfully'));
});
/**
 * POST /teacher/assignments/:id/duplicate
 */
exports.duplicateAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const source = await assertAssignmentOwnership(id, userId, userRole);
    const clonedData = source.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.__v;
    clonedData.title = `${source.title} - نسخة`;
    clonedData.status = 'Draft';
    clonedData.isDeleted = false;
    clonedData.deletedAt = null;
    const duplicated = await assignment_model_1.Assignment.create(clonedData);
    await logActivity(userId, userName, userRole, 'ASSIGNMENT_DUPLICATED', {
        sourceAssignmentId: id,
        duplicatedAssignmentId: duplicated._id,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, duplicated, 'Assignment duplicated successfully'));
});
/**
 * GET /teacher/assignments/:id/submissions
 */
exports.getAssignmentSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const { page = 1, limit = 50, status } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    await assertAssignmentOwnership(id, userId, userRole);
    const filter = { assignmentId: id };
    if (status)
        filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const submissions = await submission_model_1.Submission.find(filter)
        .populate('studentId', 'firstName lastName username email avatar')
        .populate('reviewedBy', 'firstName lastName')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await submission_model_1.Submission.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        submissions,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Submissions retrieved successfully'));
});
/**
 * GET /teacher/assignments/:id/analytics
 */
exports.getAssignmentAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const assignment = await assertAssignmentOwnership(id, userId, userRole);
    const submissions = await submission_model_1.Submission.find({ assignmentId: id }).lean();
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
            if (grade > highestGrade)
                highestGrade = grade;
            if (grade < lowestGrade)
                lowestGrade = grade;
            if (grade >= passingMarks)
                passCount++;
            else
                failCount++;
            if (s.status === 'Late')
                lateCount++;
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, analytics, 'Assignment analytics generated successfully'));
});
