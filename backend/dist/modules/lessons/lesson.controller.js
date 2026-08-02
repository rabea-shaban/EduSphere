"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.getLessonById = exports.getAllLessons = exports.createLesson = void 0;
const slugify_1 = __importDefault(require("slugify"));
const lesson_model_1 = require("./lesson.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Lesson.
 */
exports.createLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { unitId, order } = req.body;
    // Check if order already exists within the same unit
    const existingOrder = await lesson_model_1.Lesson.findOne({ unitId, order });
    if (existingOrder) {
        throw new ApiError_1.ApiError(400, `Lesson with order ${order} already exists in this unit`);
    }
    const lesson = await lesson_model_1.Lesson.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, lesson, 'Lesson created successfully'));
});
/**
 * Get all Lessons with pagination, sorting, search, and filters.
 */
exports.getAllLessons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, unitId, courseId, lessonType, isPublished, sort } = req.query;
    const filter = {};
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (unitId)
        filter.unitId = unitId;
    if (courseId)
        filter.courseId = courseId;
    if (lessonType)
        filter.lessonType = lessonType;
    if (isPublished !== undefined)
        filter.isPublished = isPublished === 'true';
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Default sorting by order ascending
    let sortBy = { order: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const lessons = await lesson_model_1.Lesson.find(filter)
        .populate('unitId', 'title order')
        .populate('courseId', 'title slug')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
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
 * Get Lesson by ID.
 */
exports.getLessonById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const lesson = await lesson_model_1.Lesson.findById(id)
        .populate('unitId', 'title order')
        .populate('courseId', 'title slug');
    if (!lesson) {
        throw new ApiError_1.ApiError(404, 'Lesson not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson retrieved successfully'));
});
/**
 * Update Lesson details.
 */
exports.updateLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const lesson = await lesson_model_1.Lesson.findById(id);
    if (!lesson) {
        throw new ApiError_1.ApiError(404, 'Lesson not found');
    }
    const { title, order, unitId } = req.body;
    const targetUnitId = unitId || lesson.unitId;
    if (order && (order !== lesson.order || unitId)) {
        const existingOrder = await lesson_model_1.Lesson.findOne({ unitId: targetUnitId, order });
        if (existingOrder && existingOrder._id.toString() !== id) {
            throw new ApiError_1.ApiError(400, `Lesson with order ${order} already exists in this unit`);
        }
    }
    if (title && title !== lesson.title) {
        lesson.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
    }
    Object.assign(lesson, req.body);
    await lesson.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, lesson, 'Lesson updated successfully'));
});
/**
 * Delete Lesson.
 */
exports.deleteLesson = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const lesson = await lesson_model_1.Lesson.findByIdAndDelete(id);
    if (!lesson) {
        throw new ApiError_1.ApiError(404, 'Lesson not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Lesson deleted successfully'));
});
