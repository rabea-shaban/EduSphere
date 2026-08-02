"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEnrollments = exports.getMyCourses = exports.completeCourse = exports.cancelEnrollment = exports.enrollStudent = void 0;
const enrollment_model_1 = require("./enrollment.model");
const course_model_1 = require("../courses/course.model");
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
 * Get courses enrolled by the logged in student.
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
    const enrollments = await enrollment_model_1.Enrollment.find(filter)
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
