"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreCourse = exports.duplicateCourse = exports.archiveCourse = exports.publishCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const slugify_1 = __importDefault(require("slugify"));
const course_model_1 = require("./course.model");
const unit_model_1 = require("../units/unit.model");
const lesson_model_1 = require("../lessons/lesson.model");
const notification_model_1 = require("../notifications/notification.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Course.
 */
exports.createCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseData = { ...req.body };
    if (!courseData.teacher && req.user) {
        courseData.teacher = req.user._id;
    }
    const title = courseData.title || req.body.title || '';
    const teacherId = courseData.teacher;
    let course = await course_model_1.Course.findOne({ title: title.trim() });
    if (course) {
        if (teacherId && course.teacher.toString() === teacherId.toString()) {
            // Re-use and update existing course if created by the same teacher
            course = await course_model_1.Course.findByIdAndUpdate(course._id, courseData, { new: true });
        }
        else {
            throw new ApiError_1.ApiError(400, 'عنوان الكورس مستخدم بالفعل، يرجى تغيير العنوان أو إضافة تمييز بسيط');
        }
    }
    // Ensure language field does not trigger MongoDB text index language override error
    if (courseData.language) {
        courseData.language = String(courseData.language).toLowerCase();
    }
    else {
        courseData.language = 'arabic';
    }
    // Map level if Arabic string provided or default to 'Beginner'
    if (courseData.level === 'جميع المراحل' || !courseData.level) {
        courseData.level = 'Beginner';
    }
    else if (courseData.level === 'مبتدئ') {
        courseData.level = 'Beginner';
    }
    else if (courseData.level === 'متوسط') {
        courseData.level = 'Intermediate';
    }
    else if (courseData.level === 'متقدم') {
        courseData.level = 'Advanced';
    }
    if (!course) {
        course = await course_model_1.Course.create(courseData);
    }
    // Send notification to course owner
    try {
        if (req.user?._id) {
            const notif = await notification_model_1.Notification.create({
                recipientId: req.user._id,
                title: 'تم إنشاء كورس جديد بنجاح 📚',
                message: `تم إنشاء كورس "${course.title}" بنجاح. يمكنك الآن الدخول لإنشاء الدروس والوحدات.`,
                type: 'Course',
                priority: 'High',
                deliveryChannel: ['InApp'],
                isRead: false,
            });
            (0, socket_1.emitToUser)(req.user._id, 'notification', notif);
        }
    }
    catch {
        // Non-critical
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, course, 'Course created successfully'));
});
/**
 * Get all Courses with filters, search, pagination, and sorting.
 */
exports.getAllCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, status, level, isFree, isFeatured, teacherId, academicYearId, gradeId, subjectId, termId, sort, } = req.query;
    const filter = { isDeleted: { $ne: true } };
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }];
    }
    if (status)
        filter.status = status;
    if (level)
        filter.level = level;
    if (isFree !== undefined)
        filter.isFree = isFree === 'true';
    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === 'true';
    if (teacherId) {
        filter.teacher = teacherId;
    }
    else if (req.user && (req.user.role === 'TEACHER' || req.path.includes('/teacher') || req.baseUrl.includes('/teacher'))) {
        filter.teacher = req.user._id;
    }
    if (academicYearId)
        filter.academicYear = academicYearId;
    if (gradeId)
        filter.grade = gradeId;
    if (subjectId)
        filter.subject = subjectId;
    if (termId)
        filter.term = termId;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const [courses, total] = await Promise.all([
        course_model_1.Course.find(filter)
            .populate('teacher', 'firstName lastName username email avatar')
            .populate('academicYear', 'title')
            .populate('grade', 'name')
            .populate('subject', 'name slug icon color')
            .populate('term', 'name')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        course_model_1.Course.countDocuments(filter),
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        courses,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Courses retrieved successfully'));
});
/**
 * Get Course by ID.
 */
exports.getCourseById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id)
        .populate('teacher', 'firstName lastName username email avatar')
        .populate('academicYear', 'title')
        .populate('grade', 'name')
        .populate('subject', 'name slug icon color')
        .populate('term', 'name');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'Course retrieved successfully'));
});
/**
 * Update Course details.
 */
exports.updateCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    const { title, thumbnailUrl, level } = req.body;
    if (title && title !== course.title) {
        const duplicate = await course_model_1.Course.findOne({ title: title.trim(), _id: { $ne: id } });
        if (duplicate) {
            throw new ApiError_1.ApiError(400, 'عنوان الكورس مستخدم بالفعل، يرجى اختيار عنوان آخر');
        }
        course.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
    }
    const updateData = { ...req.body };
    if (thumbnailUrl && !updateData.thumbnail) {
        updateData.thumbnail = thumbnailUrl;
    }
    // Map Arabic level to enum
    if (level === 'جميع المراحل' || !level) {
        updateData.level = 'Beginner';
    }
    else if (level === 'مبتدئ') {
        updateData.level = 'Beginner';
    }
    else if (level === 'متوسط') {
        updateData.level = 'Intermediate';
    }
    else if (level === 'متقدم') {
        updateData.level = 'Advanced';
    }
    Object.assign(course, updateData);
    await course.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'Course updated successfully'));
});
/**
 * Delete Course (cascades to delete associated Units and Lessons).
 */
exports.deleteCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    // Cascade Deletion
    await lesson_model_1.Lesson.deleteMany({ courseId: id });
    await unit_model_1.Unit.deleteMany({ courseId: id });
    await course.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Course and all its units and lessons deleted successfully'));
});
/**
 * Publish a Course.
 */
exports.publishCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findByIdAndUpdate(id, { status: 'Published' }, { new: true });
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'Course published successfully'));
});
/**
 * Archive a Course.
 */
exports.archiveCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findByIdAndUpdate(id, { status: 'Archived' }, { new: true });
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'Course archived successfully'));
});
/**
 * Deep duplicate a course (clones course, its units, and its lessons).
 */
exports.duplicateCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const sourceCourse = await course_model_1.Course.findById(id);
    if (!sourceCourse) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    // 1. Generate unique title
    let newTitle = `${sourceCourse.title} - Copy`;
    let titleCollision = true;
    let attempt = 1;
    while (titleCollision) {
        const existing = await course_model_1.Course.findOne({ title: newTitle });
        if (!existing) {
            titleCollision = false;
        }
        else {
            newTitle = `${sourceCourse.title} - Copy ${attempt}`;
            attempt++;
        }
    }
    // 2. Clone course details
    const clonedCourseData = sourceCourse.toObject();
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
    const duplicatedCourse = await course_model_1.Course.create(clonedCourseData);
    // 3. Duplicate Units
    const sourceUnits = await unit_model_1.Unit.find({ courseId: oldCourseId }).sort({ order: 1 });
    for (const unit of sourceUnits) {
        const clonedUnitData = unit.toObject();
        const oldUnitId = clonedUnitData._id;
        delete clonedUnitData._id;
        delete clonedUnitData.createdAt;
        delete clonedUnitData.updatedAt;
        clonedUnitData.courseId = duplicatedCourse._id;
        const duplicatedUnit = await unit_model_1.Unit.create(clonedUnitData);
        // 4. Duplicate Lessons under this unit
        const sourceLessons = await lesson_model_1.Lesson.find({ unitId: oldUnitId }).sort({ order: 1 });
        for (const lesson of sourceLessons) {
            const clonedLessonData = lesson.toObject();
            delete clonedLessonData._id;
            delete clonedLessonData.createdAt;
            delete clonedLessonData.updatedAt;
            delete clonedLessonData.slug;
            clonedLessonData.courseId = duplicatedCourse._id;
            clonedLessonData.unitId = duplicatedUnit._id;
            await lesson_model_1.Lesson.create(clonedLessonData);
        }
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, duplicatedCourse, 'Course duplicated successfully'));
});
/**
 * Restore an archived Course back to Draft/Published.
 */
exports.restoreCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.Course.findByIdAndUpdate(id, { status: 'Draft' }, { new: true });
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, course, 'Course restored to draft successfully'));
});
