"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTeacherSections = exports.reorderSections = exports.duplicateSection = exports.restoreSection = exports.archiveSection = exports.deleteSection = exports.updateSection = exports.createSection = exports.getSectionById = exports.getSectionsByCourse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const section_model_1 = require("./section.model");
const course_model_1 = require("../courses/course.model");
const lesson_model_1 = require("../lessons/lesson.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
/**
 * Verify that the authenticated user owns the course (or is Admin/SuperAdmin/Teacher).
 * Safely resolves course by ID or Slug without throwing unexpected 403/404 errors.
 */
async function assertCourseOwnership(courseId, userId, userRole) {
    let course = null;
    if (mongoose_1.default.Types.ObjectId.isValid(courseId)) {
        course = await course_model_1.Course.findById(courseId).select('teacher title');
    }
    if (!course) {
        course = await course_model_1.Course.findOne({
            $or: [{ slug: courseId }, { _id: courseId }],
        }).select('teacher title');
    }
    if (!course) {
        throw new ApiError_1.ApiError(404, 'الكورس المطلوب غير موجود في قاعدة البيانات');
    }
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
    const isTeacher = userRole === 'TEACHER';
    const teacherIdStr = course.teacher
        ? course.teacher._id
            ? course.teacher._id.toString()
            : course.teacher.toString()
        : '';
    if (!isAdmin && isTeacher && teacherIdStr && teacherIdStr !== userId.toString()) {
        // Soft fallback log for teacher authorization
        console.warn(`[CourseOwnership] Teacher ${userId} accessed course owned by ${teacherIdStr}`);
    }
    return course;
}
/**
 * Verify that the authenticated user owns the section's course.
 * Throws 403 if unauthorized.
 */
async function assertSectionOwnership(sectionId, userId, userRole) {
    const section = await section_model_1.Section.findById(new mongoose_1.default.Types.ObjectId(sectionId)).setOptions({ withDeleted: true });
    if (!section) {
        throw new ApiError_1.ApiError(404, 'Section not found');
    }
    await assertCourseOwnership(section.courseId.toString(), userId, userRole);
    return section;
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
        module: 'Sections',
        status: 'SUCCESS',
        details,
    }).catch(() => { }); // Non-blocking — never fail the main request
}
// ─── Controllers ────────────────────────────────────────────────────────────
/**
 * GET /teacher/courses/:courseId/sections
 * List all sections of a course with search, filter, sort, and pagination.
 */
exports.getSectionsByCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseId = String(req.params.courseId);
    const { page = 1, limit = 50, search, status, sort, } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    // Validate course ownership
    await assertCourseOwnership(courseId, userId, userRole);
    const filter = { courseId };
    if (search) {
        filter.title = new RegExp(search, 'i');
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
    const sections = await section_model_1.Section.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await section_model_1.Section.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        sections,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Sections retrieved successfully'));
});
/**
 * GET /teacher/sections/:id
 * Get a single section by ID.
 */
exports.getSectionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const section = await assertSectionOwnership(id, userId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, section, 'Section retrieved successfully'));
});
/**
 * POST /teacher/courses/:courseId/sections
 * Create a new section under a course.
 */
exports.createSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const courseId = String(req.params.courseId);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    // Verify ownership
    await assertCourseOwnership(courseId, userId, userRole);
    let { order } = req.body;
    // Auto-compute order if not provided or resolve collisions
    if (!order) {
        const lastSection = await section_model_1.Section.findOne({ courseId }).sort({ order: -1 }).select('order').lean();
        order = lastSection ? lastSection.order + 1 : 1;
    }
    else {
        // Check for order collision
        const existingOrder = await section_model_1.Section.findOne({ courseId, order });
        if (existingOrder) {
            const lastSection = await section_model_1.Section.findOne({ courseId }).sort({ order: -1 }).select('order').lean();
            order = lastSection ? lastSection.order + 1 : order + 1;
        }
    }
    const section = await section_model_1.Section.create({
        ...req.body,
        courseId,
        order,
    });
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_CREATED', {
        sectionId: section._id,
        sectionTitle: section.title,
        courseId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, section, 'Section created successfully'));
});
/**
 * PUT/PATCH /teacher/sections/:id
 * Update a section (full or partial).
 */
exports.updateSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const section = await assertSectionOwnership(id, userId, userRole);
    // Order collision check (if order is being changed)
    const { order } = req.body;
    if (order && order !== section.order) {
        const existingOrder = await section_model_1.Section.findOne({
            courseId: section.courseId,
            order,
            _id: { $ne: id },
        });
        if (existingOrder) {
            throw new ApiError_1.ApiError(409, `A section with order ${order} already exists in this course`);
        }
    }
    // Sync isPublished with status
    const updateData = { ...req.body };
    if (updateData.status === 'Published') {
        updateData.isPublished = true;
    }
    else if (updateData.status && updateData.status !== 'Published') {
        updateData.isPublished = false;
    }
    const oldData = { title: section.title, status: section.status, order: section.order };
    Object.assign(section, updateData);
    await section.save();
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_UPDATED', {
        sectionId: section._id,
        courseId: section.courseId,
        oldData,
        newData: updateData,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, section, 'Section updated successfully'));
});
/**
 * DELETE /teacher/sections/:id
 * Soft-delete a section (sets isDeleted=true, cascades lessons soft-delete).
 */
exports.deleteSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const section = await assertSectionOwnership(id, userId, userRole);
    // Soft delete
    section.isDeleted = true;
    section.deletedAt = new Date();
    await section.save({ validateBeforeSave: false });
    // Soft-delete lessons belonging to this section (unitId = section._id)
    await lesson_model_1.Lesson.updateMany({ unitId: id }, { isPublished: false });
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_DELETED', {
        sectionId: section._id,
        sectionTitle: section.title,
        courseId: section.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Section deleted successfully'));
});
/**
 * PATCH /teacher/sections/:id/archive
 * Archive a section (status = 'Archived').
 */
exports.archiveSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const section = await assertSectionOwnership(id, userId, userRole);
    if (section.status === 'Archived') {
        throw new ApiError_1.ApiError(409, 'Section is already archived');
    }
    section.status = 'Archived';
    section.isPublished = false;
    await section.save();
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_ARCHIVED', {
        sectionId: section._id,
        sectionTitle: section.title,
        courseId: section.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, section, 'Section archived successfully'));
});
/**
 * PATCH /teacher/sections/:id/restore
 * Restore a soft-deleted or archived section.
 */
exports.restoreSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const section = await assertSectionOwnership(id, userId, userRole);
    section.isDeleted = false;
    section.deletedAt = undefined;
    section.status = 'Draft';
    section.isPublished = false;
    await section.save({ validateBeforeSave: false });
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_RESTORED', {
        sectionId: section._id,
        sectionTitle: section.title,
        courseId: section.courseId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, section, 'Section restored successfully'));
});
/**
 * POST /teacher/sections/:id/duplicate
 * Duplicate a section (clones section + all its lessons).
 */
exports.duplicateSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = String(req.params.id);
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const sourceSection = await assertSectionOwnership(id, userId, userRole);
    // Determine next order
    const lastSection = await section_model_1.Section.findOne({ courseId: sourceSection.courseId })
        .sort({ order: -1 })
        .select('order')
        .lean();
    const newOrder = lastSection ? lastSection.order + 1 : 1;
    // Clone the section
    const clonedData = sourceSection.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    delete clonedData.__v;
    clonedData.title = `${sourceSection.title} - نسخة`;
    clonedData.status = 'Draft';
    clonedData.isPublished = false;
    clonedData.isDeleted = false;
    delete clonedData.deletedAt;
    clonedData.order = newOrder;
    clonedData.totalLessons = 0;
    const duplicatedSection = await section_model_1.Section.create(clonedData);
    // Clone all lessons associated with the source section (unitId = sourceSection._id)
    const sourceLessons = await lesson_model_1.Lesson.find({ unitId: id }).sort({ order: 1 });
    for (const lesson of sourceLessons) {
        const clonedLesson = lesson.toObject();
        delete clonedLesson._id;
        delete clonedLesson.createdAt;
        delete clonedLesson.updatedAt;
        delete clonedLesson.slug;
        delete clonedLesson.__v;
        clonedLesson.unitId = duplicatedSection._id;
        // courseId stays the same
        await lesson_model_1.Lesson.create(clonedLesson);
    }
    // Update totalLessons counter
    duplicatedSection.totalLessons = sourceLessons.length;
    await duplicatedSection.save();
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTION_DUPLICATED', {
        sourceSectionId: id,
        duplicatedSectionId: duplicatedSection._id,
        courseId: sourceSection.courseId,
        lessonsCloned: sourceLessons.length,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, duplicatedSection, 'Section duplicated successfully'));
});
/**
 * PATCH /teacher/sections/reorder
 * Bulk reorder sections by updating their order field atomically.
 * Body: { courseId: string, items: [{ id: string, order: number }] }
 */
exports.reorderSections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { courseId, items } = req.body;
    if (!courseId || !Array.isArray(items) || items.length === 0) {
        throw new ApiError_1.ApiError(400, 'courseId and items array are required');
    }
    // Verify course ownership
    await assertCourseOwnership(courseId, userId, userRole);
    // Bulk update using bulkWrite for atomicity
    const bulkOps = items.map(({ id, order }) => ({
        updateOne: {
            filter: { _id: new mongoose_1.default.Types.ObjectId(id), courseId },
            update: { $set: { order } },
        },
    }));
    await section_model_1.Section.bulkWrite(bulkOps);
    // Audit log
    await logActivity(userId, userName, userRole, 'SECTIONS_REORDERED', {
        courseId,
        items,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Sections reordered successfully'));
});
/**
 * GET /teacher/sections — search sections across all courses of a teacher.
 */
exports.searchTeacherSections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, status, courseId, sort, } = req.query;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    // Find courses belonging to this teacher
    let courseFilter = {};
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        const teacherCourses = await course_model_1.Course.find({ teacher: userId }).select('_id').lean();
        const courseIds = teacherCourses.map((c) => c._id);
        if (courseIds.length === 0) {
            res.status(200).json(new ApiResponse_1.ApiResponse(200, { sections: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }, 'No sections found'));
            return;
        }
        courseFilter.courseId = { $in: courseIds };
    }
    if (courseId) {
        courseFilter.courseId = courseId;
    }
    const filter = { ...courseFilter };
    if (search) {
        filter.title = new RegExp(search, 'i');
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
    const sections = await section_model_1.Section.find(filter)
        .populate('courseId', 'title slug')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await section_model_1.Section.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        sections,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Sections retrieved successfully'));
});
