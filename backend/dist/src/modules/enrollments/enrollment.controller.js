"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEnrollments = exports.getMyCourses = exports.completeCourse = exports.cancelEnrollment = exports.enrollStudent = void 0;
const enrollment_model_1 = require("./enrollment.model");
const course_model_1 = require("../courses/course.model");
const notification_model_1 = require("../notifications/notification.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Enroll a student in a course.
 */
exports.enrollStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId, paymentStatus } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // Strict Role Check: Only students can enroll in courses
    if (req.user?.role !== 'STUDENT') {
        throw new ApiError_1.ApiError(400, 'حسابك مسجل كمعلم/إدارة — لا يمكن للمدرس أو المدير الاشتراك في الكورسات كطالب. يمكنك استخدام وضع المعاينة بدلاً من ذلك.');
    }
    // 1. Check if course exists and is published
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    if (course.status !== 'Published') {
        throw new ApiError_1.ApiError(400, 'Cannot enroll in a course that is not published');
    }
    // 2. Check for duplicate enrollment
    const existingEnrollment = await enrollment_model_1.Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
        throw new ApiError_1.ApiError(400, 'You are already enrolled in this course');
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
    const enrollment = await enrollment_model_1.Enrollment.create({
        studentId,
        courseId,
        teacherId: course.teacher,
        status,
        paymentStatus: finalPaymentStatus,
        purchasePrice,
        enrolledAt: new Date(),
    });
    // 5. Increment course enrollment count
    await course_model_1.Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    // 6. Send automatic notifications to Student and Teacher
    try {
        const studentName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || 'الطالب';
        // Notification to Student
        const studentNotif = await notification_model_1.Notification.create({
            recipientId: studentId,
            title: 'تم تسجيلك بنجاح في الكورس 🎓',
            message: `مرحباً بك في كورس "${course.title}". يمكنك الآن البدء في متابعة الدروس والاختبارات.`,
            type: 'Course',
            priority: 'High',
            deliveryChannel: ['InApp'],
            isRead: false,
        });
        (0, socket_1.emitToUser)(studentId, 'notification', studentNotif);
        // Notification to Teacher (if present)
        if (course.teacher) {
            const teacherNotif = await notification_model_1.Notification.create({
                recipientId: course.teacher,
                title: 'انضمام طالب جديد إلى كورس 👨‍🎓',
                message: `قام الطالب "${studentName}" بالاشتراك في كورس "${course.title}".`,
                type: 'Course',
                priority: 'Medium',
                deliveryChannel: ['InApp'],
                isRead: false,
            });
            (0, socket_1.emitToUser)(course.teacher, 'notification', teacherNotif);
        }
    }
    catch {
        // Non-critical — don't break enrollment flow if notification fails
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, enrollment, 'Enrolled successfully'));
});
/**
 * Cancel a student enrollment.
 */
exports.cancelEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enrollment = await enrollment_model_1.Enrollment.findById(id);
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, 'Enrollment not found');
    }
    if (enrollment.status === 'Cancelled') {
        throw new ApiError_1.ApiError(400, 'Enrollment is already cancelled');
    }
    enrollment.status = 'Cancelled';
    await enrollment.save();
    // Decrement course enrollment count
    await course_model_1.Course.findByIdAndUpdate(enrollment.courseId, { $inc: { enrollmentCount: -1 } });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollment, 'Enrollment cancelled successfully'));
});
/**
 * Manually mark enrollment as completed.
 */
exports.completeCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enrollment = await enrollment_model_1.Enrollment.findById(id);
    if (!enrollment) {
        throw new ApiError_1.ApiError(404, 'Enrollment not found');
    }
    if (enrollment.status === 'Completed') {
        throw new ApiError_1.ApiError(400, 'Course is already completed');
    }
    enrollment.status = 'Completed';
    enrollment.completedAt = new Date();
    enrollment.certificateIssued = true;
    await enrollment.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollment, 'Course completed successfully'));
});
/**
 * Get courses enrolled by the logged in student with real DB lesson counts and watch progress.
 */
exports.getMyCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?._id;
    const { page = 1, limit = 10, status } = req.query;
    const filter = { studentId };
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const rawEnrollments = await enrollment_model_1.Enrollment.find(filter)
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
    const Unit = (await Promise.resolve().then(() => __importStar(require('../units/unit.model')))).Unit;
    const Lesson = (await Promise.resolve().then(() => __importStar(require('../lessons/lesson.model')))).Lesson;
    const Progress = (await Promise.resolve().then(() => __importStar(require('../progress/progress.model')))).Progress;
    const enrollments = await Promise.all(rawEnrollments.map(async (enrollment) => {
        const doc = enrollment.toObject();
        const courseObj = typeof doc.courseId === 'object' ? doc.courseId : null;
        if (courseObj && courseObj._id) {
            // 1. Find all units belonging to this course
            const unitDocs = await Unit.find({ courseId: courseObj._id }).select('_id').lean();
            const unitIds = unitDocs.map((u) => u._id);
            // 2. Count lessons linked by courseId or unitIds
            let totalLessons = await Lesson.countDocuments({
                $or: [
                    { courseId: courseObj._id },
                    { unitId: { $in: unitIds } },
                    { sectionId: { $in: unitIds } },
                ],
            });
            // 3. Fallback to course properties if 0
            if (totalLessons === 0) {
                totalLessons =
                    courseObj.lessonCount ||
                        courseObj.lessonsCount ||
                        (Array.isArray(courseObj.lessons) ? courseObj.lessons.length : 0);
            }
            const completedLessons = await Progress.countDocuments({
                studentId,
                courseId: courseObj._id,
                completed: true,
            });
            doc.totalLessons = totalLessons;
            doc.completedLessons = completedLessons;
            doc.progressPercentage =
                totalLessons > 0
                    ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
                    : doc.status === 'Completed'
                        ? 100
                        : 0;
            courseObj.lessonCount = totalLessons;
        }
        return doc;
    }));
    const total = await enrollment_model_1.Enrollment.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        enrollments,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Enrolled courses retrieved successfully'));
});
/**
 * Get all enrollments (Admin and Teachers).
 */
exports.getAllEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, courseId, teacherId, studentId, status, paymentStatus } = req.query;
    const filter = {};
    if (courseId)
        filter.courseId = courseId;
    if (teacherId)
        filter.teacherId = teacherId;
    if (studentId)
        filter.studentId = studentId;
    if (status)
        filter.status = status;
    if (paymentStatus)
        filter.paymentStatus = paymentStatus;
    // Teachers can only view enrollments of their own courses
    if (req.user && req.user.role === 'TEACHER') {
        filter.teacherId = req.user._id;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const enrollments = await enrollment_model_1.Enrollment.find(filter)
        .populate('studentId', 'firstName lastName username email avatar')
        .populate('courseId', 'title slug thumbnail')
        .populate('teacherId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await enrollment_model_1.Enrollment.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        enrollments,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'All enrollments retrieved successfully'));
});
