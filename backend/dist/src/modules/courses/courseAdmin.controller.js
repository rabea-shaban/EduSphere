"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteCourseAdmin = exports.changeCourseStatusAdmin = exports.featureCourseAdmin = exports.rejectCourseAdmin = exports.approveCourseAdmin = exports.updateCourseAdmin = exports.getCourseEnrollmentsAdmin = exports.getCourseByIdAdmin = exports.getAllCoursesAdmin = void 0;
const mongoose_1 = require("mongoose");
const course_model_1 = require("./course.model");
const unit_model_1 = require("../units/unit.model");
const lesson_model_1 = require("../lessons/lesson.model");
const quiz_model_1 = require("../quizzes/quiz.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const payment_model_1 = require("../payments/payment.model");
const notification_model_1 = require("../notifications/notification.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Get all courses across platform for Super Admin with real stats, filters, search, and pagination.
 */
exports.getAllCoursesAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, status, isFree, isFeatured, teacher, subject, grade, sort = 'newest', } = req.query;
    const filter = {};
    if (status && status !== 'All') {
        filter.status = status;
    }
    if (isFree !== undefined && isFree !== 'All') {
        filter.isFree = isFree === 'true';
    }
    if (isFeatured !== undefined && isFeatured !== 'All') {
        filter.isFeatured = isFeatured === 'true';
    }
    if (teacher && mongoose_1.Types.ObjectId.isValid(teacher)) {
        filter.teacher = new mongoose_1.Types.ObjectId(teacher);
    }
    if (subject && mongoose_1.Types.ObjectId.isValid(subject)) {
        filter.subject = new mongoose_1.Types.ObjectId(subject);
    }
    if (grade && mongoose_1.Types.ObjectId.isValid(grade)) {
        filter.grade = new mongoose_1.Types.ObjectId(grade);
    }
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { title: searchRegex },
            { description: searchRegex },
            ...(mongoose_1.Types.ObjectId.isValid(search) ? [{ _id: new mongoose_1.Types.ObjectId(search) }] : []),
        ];
    }
    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest')
        sortOption = { createdAt: 1 };
    if (sort === 'newest')
        sortOption = { createdAt: -1 };
    if (sort === 'highest_rating')
        sortOption = { rating: -1 };
    if (sort === 'most_students')
        sortOption = { enrollmentCount: -1 };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const rawCourses = await course_model_1.Course.find(filter)
        .populate('teacher', 'firstName lastName email avatar phone')
        .populate('subject', 'nameCode title')
        .populate('grade', 'nameCode title')
        .populate('academicYear', 'title')
        .populate('term', 'title')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);
    const total = await course_model_1.Course.countDocuments(filter);
    // Enrich with real aggregated financial & unit/lesson metrics
    const coursesList = await Promise.all(rawCourses.map(async (c) => {
        const courseId = c._id;
        // Real active enrollments
        const activeEnrollmentsCount = await enrollment_model_1.Enrollment.countDocuments({
            courseId,
            status: { $in: ['Active', 'Completed'] },
        });
        // Real revenue sum from paid payments
        const revAgg = await payment_model_1.Payment.aggregate([
            { $match: { courseId, status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const revenue = revAgg[0]?.total || 0;
        // Real units and lessons count
        const unitsCount = await unit_model_1.Unit.countDocuments({ courseId });
        const lessonsCount = await lesson_model_1.Lesson.countDocuments({ courseId });
        const teacherObj = c.teacher || {};
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
            subjectName: c.subject?.title || c.subject?.nameCode || 'غير محدد',
            gradeName: c.grade?.title || c.grade?.nameCode || 'غير محدد',
            enrollmentCount: activeEnrollmentsCount || c.enrollmentCount || 0,
            revenue,
            unitsCount,
            lessonsCount,
        };
    }));
    if (sort === 'highest_revenue') {
        coursesList.sort((a, b) => b.revenue - a.revenue);
    }
    else if (sort === 'most_lessons') {
        coursesList.sort((a, b) => b.lessonsCount - a.lessonsCount);
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        courses: coursesList,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Platform courses retrieved successfully for admin'));
});
/**
 * Get full course details and curriculum tree for Super Admin moderation.
 */
exports.getCourseByIdAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id)
        .populate('teacher', 'firstName lastName email avatar phone')
        .populate('subject', 'title nameCode')
        .populate('grade', 'title nameCode')
        .populate('academicYear', 'title')
        .populate('term', 'title');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    // Get units & lessons
    const units = await unit_model_1.Unit.find({ courseId: id }).sort({ order: 1 });
    const unitsWithLessons = await Promise.all(units.map(async (u) => {
        const lessons = await lesson_model_1.Lesson.find({ unitId: u._id }).sort({ order: 1 });
        return {
            _id: u._id,
            title: u.title,
            description: u.description,
            order: u.order,
            lessons,
        };
    }));
    // Stats
    const enrollmentsCount = await enrollment_model_1.Enrollment.countDocuments({ courseId: id });
    const completedEnrollmentsCount = await enrollment_model_1.Enrollment.countDocuments({ courseId: id, status: 'Completed' });
    const quizzesCount = await quiz_model_1.Quiz.countDocuments({ courseId: id });
    const revAgg = await payment_model_1.Payment.aggregate([
        { $match: { courseId: new mongoose_1.Types.ObjectId(id), status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revAgg[0]?.total || 0;
    const teacherObj = course.teacher || {};
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, fullDetails, 'Course details retrieved successfully'));
});
/**
 * Get enrollments for a specific course.
 */
exports.getCourseEnrollmentsAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const enrollments = await enrollment_model_1.Enrollment.find({ courseId: id })
        .populate('studentId', 'firstName lastName email avatar phone')
        .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, enrollments, 'Course enrollments retrieved successfully'));
});
/**
 * Update course details by Admin.
 */
exports.updateCourseAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    Object.assign(course, req.body);
    await course.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'تم تحديث بيانات الكورس بنجاح'));
});
/**
 * Approve course for publishing.
 */
exports.approveCourseAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    course.status = 'Published';
    await course.save();
    // Send notification to teacher
    if (course.teacher) {
        const teacherId = course.teacher._id || course.teacher;
        await notification_model_1.Notification.create({
            recipientId: teacherId,
            title: 'تمت الموافقة ونشر الكورس بنجاح 🎉',
            message: `يسرنا إعلامك بأنه تم اعتماد ونشر كورس "${course.title}" بالمنصة.`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
        (0, socket_1.emitToUser)(teacherId, 'notification', { type: 'course_approved', courseId: course._id });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تمت الموافقة ونشر الكورس بنجاح'));
});
/**
 * Reject course with reason.
 */
exports.rejectCourseAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason)
        throw new ApiError_1.ApiError(400, 'سبب رفض الكورس إلزامي');
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    course.status = 'Draft';
    await course.save();
    if (course.teacher) {
        const teacherId = course.teacher._id || course.teacher;
        await notification_model_1.Notification.create({
            recipientId: teacherId,
            title: 'تنبيه: مراجعة طلب كورس ⚠️',
            message: `تم رفض كورس "${course.title}". السبب: ${reason}`,
            type: 'System',
            priority: 'High',
            isRead: false,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم تسجيل رفض الكورس وإبلاغ المحاضر بالسبب'));
});
/**
 * Toggle feature badge for course.
 */
exports.featureCourseAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    course.isFeatured = !course.isFeatured;
    await course.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, course.isFeatured ? 'تم تمييز الكورس كمحتوى متميز 🌟' : 'تم إزالة التمييز عن الكورس'));
});
/**
 * Publish / Unpublish / Archive course status.
 */
exports.changeCourseStatusAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Draft', 'Published', 'Archived'].includes(status)) {
        throw new ApiError_1.ApiError(400, 'حالة الكورس غير صالحة');
    }
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    course.status = status;
    await course.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, `تم تغيير حالة الكورس إلى ${status}`));
});
/**
 * Soft delete course.
 */
exports.softDeleteCourseAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course)
        throw new ApiError_1.ApiError(404, 'Course not found');
    course.status = 'Archived';
    await course.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'تم أرشفة ونقل الكورس للمحذوفات بنجاح'));
});
