"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLessons = exports.moveLesson = exports.reorderLessons = exports.duplicateLesson = exports.restoreLesson = exports.archiveLesson = exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLessonById = exports.searchTeacherLessons = exports.getLessonsBySection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const lesson_model_1 = require("./lesson.model");
const section_model_1 = require("../sections/section.model");
const unit_model_1 = require("../units/unit.model");
const course_model_1 = require("../courses/course.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Security & Helper Functions ─────────────────────────────────────────────
/**
 * Verify that section exists and teacher owns the parent course.
 */
async function assertSectionAndCourseOwnership(sectionId, userId, userRole) {
    let section = await section_model_1.Section.findById(sectionId);
    let courseId = section?.courseId;
    if (!section) {
        const unit = await unit_model_1.Unit.findById(sectionId);
        if (unit) {
            section = unit;
            courseId = unit.courseId;
        }
    }
    if (!section) {
        throw new ApiError_1.ApiError(404, 'Section or Unit not found');
    }
    const course = await course_model_1.Course.findById(courseId).select('teacher title');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found for this section');
    }
    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
    if (!isAdmin && course.teacher.toString() !== userId.toString()) {
        throw new ApiError_1.ApiError(403, 'Access denied. You can only manage lessons in your own courses.');
    }
    return { section, course };
}
/**
 * Verify that lesson exists and teacher owns the parent course.
 */
async function assertLessonAndCourseOwnership(lessonId, userId, userRole) {
    const lesson = await lesson_model_1.Lesson.findById(new mongoose_1.default.Types.ObjectId(lessonId)).setOptions({
        withDeleted: true,
    });
    if (!lesson) {
        throw new ApiError_1.ApiError(404, 'Lesson not found');
    }
    const course = await course_model_1.Course.findById(lesson.courseId).select('teacher title');
    if (!course) {
        throw new ApiError_1.ApiError(404, 'Course not found for this lesson');
    }
    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
    if (!isAdmin && course.teacher.toString() !== userId.toString()) {
        throw new ApiError_1.ApiError(403, 'Access denied. You can only manage lessons in your own courses.');
    }
    return { lesson, course };
}
/**
 * Record an audit log entry.
 */
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Course',
        module: 'Lessons',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Controllers ────────────────────────────────────────────────────────────
/**
 * GET /teacher/sections/:sectionId/lessons
 * Get all lessons for a specific section.
 */
exports.getLessonsBySection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sectionId = String(req.params.sectionId);
    const { page = 1, limit = 50, search, lessonType, status, sort } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    await assertSectionAndCourseOwnership(sectionId, userId, userRole);
    const filter = {
        $or: [{ sectionId }, { unitId: sectionId }],
    };
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (lessonType) {
        filter.lessonType = lessonType;
    }
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    let sortBy = { order: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const lessons = await lesson_model_1.Lesson.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await lesson_model_1.Lesson.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        lessons,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Lessons retrieved successfully'));
});
/**
 * GET /teacher/lessons
 * Global search & filter across all lessons belonging to the teacher.
 */
exports.searchTeacherLessons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, lessonType, status, sectionId, courseId, sort, } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    // Filter courses owned by this teacher
    const filter = {};
    if (courseId) {
        const cStr = String(courseId);
        if (mongoose_1.default.Types.ObjectId.isValid(cStr)) {
            filter.courseId = new mongoose_1.default.Types.ObjectId(cStr);
        }
        else {
            const foundCourse = await course_model_1.Course.findOne({ slug: cStr }).select('_id').lean();
            if (foundCourse) {
                filter.courseId = foundCourse._id;
            }
            else {
                filter.courseId = cStr;
            }
        }
    }
    else if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        const teacherCourses = await course_model_1.Course.find({
            $or: [{ teacher: userId }, { instructor: userId }, { createdBy: userId }]
        }).select('_id').lean();
        const courseIds = teacherCourses.map((c) => c._id);
        if (courseIds.length === 0) {
            res.status(200).json(new ApiResponse_1.ApiResponse(200, { lessons: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }, 'No lessons found'));
            return;
        }
        filter.courseId = { $in: courseIds };
    }
    if (sectionId) {
        filter.$or = [{ sectionId }, { unitId: sectionId }];
    }
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (lessonType) {
        filter.lessonType = lessonType;
    }
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    let sortBy = { createdAt: -1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const lessons = await lesson_model_1.Lesson.find(filter)
        .populate('sectionId', 'title order')
        .populate('courseId', 'title slug')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await lesson_model_1.Lesson.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        lessons,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Lessons retrieved successfully'));
});
/**
 * GET /teacher/lessons/:id
 * Get a single lesson by ID.
 */
exports.getLessonById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson retrieved successfully'));
});
/**
 * POST /teacher/sections/:sectionId/lessons or POST /teacher/lessons
 * Create a new lesson.
 */
exports.createLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sectionId = req.params.sectionId
        ? String(req.params.sectionId)
        : req.body.sectionId || req.body.unitId;
    if (!sectionId) {
        throw new ApiError_1.ApiError(400, 'sectionId or unitId is required');
    }
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { section, course } = await assertSectionAndCourseOwnership(sectionId, userId, userRole);
    let { order } = req.body;
    // Auto-compute order if not provided
    if (!order) {
        const lastLesson = await lesson_model_1.Lesson.findOne({
            $or: [{ sectionId }, { unitId: sectionId }],
        })
            .sort({ order: -1 })
            .select('order')
            .lean();
        order = lastLesson ? lastLesson.order + 1 : 1;
    }
    else {
        // Collision check
        const existingOrder = await lesson_model_1.Lesson.findOne({
            $or: [{ sectionId }, { unitId: sectionId }],
            order,
        });
        if (existingOrder) {
            const lastLesson = await lesson_model_1.Lesson.findOne({
                $or: [{ sectionId }, { unitId: sectionId }],
            })
                .sort({ order: -1 })
                .select('order')
                .lean();
            order = lastLesson ? lastLesson.order + 1 : order + 1;
        }
    }
    const lessonData = {
        ...req.body,
        sectionId: section._id,
        unitId: section._id,
        courseId: course._id,
        order,
    };
    if (lessonData.title) {
        lessonData.slug =
            (0, slugify_1.default)(lessonData.title, { lower: true, strict: true }) +
                '-' +
                Math.floor(1000 + Math.random() * 9000);
    }
    const lesson = await lesson_model_1.Lesson.create(lessonData);
    // Update section totalLessons counter
    await section_model_1.Section.findByIdAndUpdate(section._id, { $inc: { totalLessons: 1 } });
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_CREATED', {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        sectionId: section._id,
        courseId: course._id,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, lesson, 'Lesson created successfully'));
});
/**
 * PUT/PATCH /teacher/lessons/:id
 * Update a lesson.
 */
exports.updateLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    const { title, order } = req.body;
    const targetSectionId = lesson.sectionId || lesson.unitId;
    // Order collision check
    if (order && order !== lesson.order) {
        const existingOrder = await lesson_model_1.Lesson.findOne({
            $or: [{ sectionId: targetSectionId }, { unitId: targetSectionId }],
            order,
            _id: { $ne: id },
        });
        if (existingOrder) {
            throw new ApiError_1.ApiError(409, `A lesson with order ${order} already exists in this section`);
        }
    }
    if (title && title !== lesson.title) {
        req.body.slug =
            (0, slugify_1.default)(title, { lower: true, strict: true }) +
                '-' +
                Math.floor(1000 + Math.random() * 9000);
    }
    // Sync isPublished with status
    if (req.body.status === 'Published') {
        req.body.isPublished = true;
    }
    else if (req.body.status && req.body.status !== 'Published') {
        req.body.isPublished = false;
    }
    const oldData = { title: lesson.title, status: lesson.status, order: lesson.order };
    Object.assign(lesson, req.body);
    await lesson.save();
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_UPDATED', {
        lessonId: lesson._id,
        sectionId: lesson.sectionId,
        courseId: lesson.courseId,
        oldData,
        newData: req.body,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson updated successfully'));
});
/**
 * DELETE /teacher/lessons/:id
 * Soft-delete a lesson (sets isDeleted=true).
 */
exports.deleteLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    lesson.isDeleted = true;
    lesson.deletedAt = new Date();
    await lesson.save({ validateBeforeSave: false });
    // Update section totalLessons counter
    if (lesson.sectionId || lesson.unitId) {
        const secId = lesson.sectionId || lesson.unitId;
        await section_model_1.Section.findByIdAndUpdate(secId, { $inc: { totalLessons: -1 } });
    }
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_DELETED', {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        sectionId: lesson.sectionId,
        courseId: lesson.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Lesson deleted successfully'));
});
/**
 * PATCH /teacher/lessons/:id/archive
 * Archive a lesson (status = 'Archived').
 */
exports.archiveLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    if (lesson.status === 'Archived') {
        throw new ApiError_1.ApiError(409, 'Lesson is already archived');
    }
    lesson.status = 'Archived';
    lesson.isPublished = false;
    await lesson.save();
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_ARCHIVED', {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        sectionId: lesson.sectionId,
        courseId: lesson.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson archived successfully'));
});
/**
 * PATCH /teacher/lessons/:id/restore
 * Restore a soft-deleted or archived lesson.
 */
exports.restoreLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    lesson.isDeleted = false;
    lesson.deletedAt = undefined;
    lesson.status = 'Draft';
    lesson.isPublished = false;
    await lesson.save({ validateBeforeSave: false });
    if (lesson.sectionId || lesson.unitId) {
        const secId = lesson.sectionId || lesson.unitId;
        await section_model_1.Section.findByIdAndUpdate(secId, { $inc: { totalLessons: 1 } });
    }
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_RESTORED', {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        sectionId: lesson.sectionId,
        courseId: lesson.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson restored successfully'));
});
/**
 * POST /teacher/lessons/:id/duplicate
 * Duplicate a lesson inside the same section.
 */
exports.duplicateLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { lesson: sourceLesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    const targetSectionId = sourceLesson.sectionId || sourceLesson.unitId;
    // Compute next order
    const lastLesson = await lesson_model_1.Lesson.findOne({
        $or: [{ sectionId: targetSectionId }, { unitId: targetSectionId }],
    })
        .sort({ order: -1 })
        .select('order')
        .lean();
    const newOrder = lastLesson ? lastLesson.order + 1 : 1;
    const clonedData = sourceLesson.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.slug;
    delete clonedData.__v;
    clonedData.title = `${sourceLesson.title} - نسخة`;
    clonedData.status = 'Draft';
    clonedData.isPublished = false;
    clonedData.isDeleted = false;
    delete clonedData.deletedAt;
    clonedData.order = newOrder;
    const duplicatedLesson = await lesson_model_1.Lesson.create(clonedData);
    if (targetSectionId) {
        await section_model_1.Section.findByIdAndUpdate(targetSectionId, { $inc: { totalLessons: 1 } });
    }
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_DUPLICATED', {
        sourceLessonId: id,
        duplicatedLessonId: duplicatedLesson._id,
        sectionId: targetSectionId,
        courseId: sourceLesson.courseId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, duplicatedLesson, 'Lesson duplicated successfully'));
});
/**
 * PATCH /teacher/lessons/reorder
 * Bulk reorder lessons.
 */
exports.reorderLessons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { sectionId, items } = req.body;
    if (!sectionId || !Array.isArray(items) || items.length === 0) {
        throw new ApiError_1.ApiError(400, 'sectionId and items array are required');
    }
    await assertSectionAndCourseOwnership(sectionId, userId, userRole);
    const bulkOps = items.map(({ id, order }) => ({
        updateOne: {
            filter: { _id: new mongoose_1.default.Types.ObjectId(id) },
            update: { $set: { order } },
        },
    }));
    await lesson_model_1.Lesson.bulkWrite(bulkOps);
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_REORDERED', {
        sectionId,
        items,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Lessons reordered successfully'));
});
/**
 * PATCH /teacher/lessons/:id/move
 * Move a lesson to another section.
 */
exports.moveLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const { targetSectionId } = req.body;
    if (!targetSectionId) {
        throw new ApiError_1.ApiError(400, 'targetSectionId is required');
    }
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    // 1. Verify current lesson & course ownership
    const { lesson } = await assertLessonAndCourseOwnership(id, userId, userRole);
    // 2. Verify target section & course ownership
    const { section: targetSection } = await assertSectionAndCourseOwnership(targetSectionId, userId, userRole);
    const oldSectionId = lesson.sectionId || lesson.unitId;
    // Compute order in target section
    const lastLesson = await lesson_model_1.Lesson.findOne({
        $or: [{ sectionId: targetSection._id }, { unitId: targetSection._id }],
    })
        .sort({ order: -1 })
        .select('order')
        .lean();
    const newOrder = req.body.order || (lastLesson ? lastLesson.order + 1 : 1);
    lesson.sectionId = targetSection._id;
    lesson.unitId = targetSection._id;
    lesson.courseId = targetSection.courseId;
    lesson.order = newOrder;
    await lesson.save();
    // Update totalLessons on old and new section
    if (oldSectionId && oldSectionId.toString() !== targetSection._id.toString()) {
        await section_model_1.Section.findByIdAndUpdate(oldSectionId, { $inc: { totalLessons: -1 } });
        await section_model_1.Section.findByIdAndUpdate(targetSection._id, { $inc: { totalLessons: 1 } });
    }
    // Audit log
    await logActivity(userId, userName, userRole, 'LESSON_MOVED', {
        lessonId: lesson._id,
        fromSectionId: oldSectionId,
        toSectionId: targetSection._id,
        courseId: targetSection.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson moved successfully'));
});
/**
 * Public/Student endpoint: Get lessons by course or unit (backward compatibility)
 */
exports.getAllLessons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, unitId, sectionId, courseId, lessonType, status, isPublished, sort } = req.query;
    // Explicitly exclude deleted lessons so countDocuments is consistent with find()
    // (countDocuments does NOT trigger the pre(/^find/) soft-delete hook)
    const filter = { isDeleted: { $ne: true } };
    if (search)
        filter.title = new RegExp(search, 'i');
    if (unitId || sectionId) {
        const secId = sectionId || unitId;
        filter.$or = [{ sectionId: secId }, { unitId: secId }];
    }
    if (courseId) {
        const cStr = String(courseId);
        if (mongoose_1.default.Types.ObjectId.isValid(cStr)) {
            filter.courseId = new mongoose_1.default.Types.ObjectId(cStr);
        }
        else {
            const foundCourse = await course_model_1.Course.findOne({ slug: cStr }).select('_id').lean();
            if (foundCourse) {
                filter.courseId = foundCourse._id;
            }
            else {
                filter.courseId = cStr;
            }
        }
    }
    if (lessonType)
        filter.lessonType = lessonType;
    if (status)
        filter.status = status;
    if (isPublished !== undefined)
        filter.isPublished = isPublished === 'true';
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(200, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    let sortBy = { order: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const [lessons, total] = await Promise.all([
        lesson_model_1.Lesson.find(filter)
            .populate('sectionId', 'title order')
            .populate('unitId', 'title order')
            .populate('courseId', 'title slug')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        lesson_model_1.Lesson.countDocuments(filter),
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        lessons,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Lessons retrieved successfully'));
});
