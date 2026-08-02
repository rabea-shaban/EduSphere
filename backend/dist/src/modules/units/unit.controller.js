"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.updateUnit = exports.getUnitById = exports.getAllUnits = exports.createUnit = void 0;
const unit_model_1 = require("./unit.model");
const lesson_model_1 = require("../lessons/lesson.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Unit.
 */
exports.createUnit = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.body;
    let { order } = req.body;
    // Auto-compute order if not provided or if there's a collision
    if (!order) {
        const lastUnit = await unit_model_1.Unit.findOne({ courseId }).sort({ order: -1 }).select('order');
        order = lastUnit ? lastUnit.order + 1 : 1;
    }
    else {
        // Check for order collision and resolve by incrementing
        const existingOrder = await unit_model_1.Unit.findOne({ courseId, order });
        if (existingOrder) {
            const lastUnit = await unit_model_1.Unit.findOne({ courseId }).sort({ order: -1 }).select('order');
            order = lastUnit ? lastUnit.order + 1 : order + 1;
        }
    }
    const unit = await unit_model_1.Unit.create({ ...req.body, order });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, unit, 'Unit created successfully'));
});
/**
 * Get all Units with query search, pagination, and courseId filters.
 */
exports.getAllUnits = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, courseId, isPublished, sort } = req.query;
    const filter = {};
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (courseId) {
        filter.courseId = courseId;
    }
    if (isPublished !== undefined) {
        filter.isPublished = isPublished === 'true';
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Default sorting by order ascending
    let sortBy = { order: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const units = await unit_model_1.Unit.find(filter)
        .populate('courseId', 'title slug')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
    const total = await unit_model_1.Unit.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        units,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Units retrieved successfully'));
});
/**
 * Get Unit by ID.
 */
exports.getUnitById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const unit = await unit_model_1.Unit.findById(id).populate('courseId', 'title slug');
    if (!unit) {
        throw new ApiError_1.ApiError(404, 'Unit not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, unit, 'Unit retrieved successfully'));
});
/**
 * Update Unit details.
 */
exports.updateUnit = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const unit = await unit_model_1.Unit.findById(id);
    if (!unit) {
        throw new ApiError_1.ApiError(404, 'Unit not found');
    }
    const { order, courseId } = req.body;
    const targetCourseId = courseId || unit.courseId;
    if (order && (order !== unit.order || courseId)) {
        const existingOrder = await unit_model_1.Unit.findOne({ courseId: targetCourseId, order });
        if (existingOrder && existingOrder._id.toString() !== id) {
            throw new ApiError_1.ApiError(400, `Unit with order ${order} already exists in this course`);
        }
    }
    Object.assign(unit, req.body);
    await unit.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, unit, 'Unit updated successfully'));
});
/**
 * Delete Unit (cascades to delete all lessons associated with this unit).
 */
exports.deleteUnit = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const unit = await unit_model_1.Unit.findById(id);
    if (!unit) {
        throw new ApiError_1.ApiError(404, 'Unit not found');
    }
    // Cascade delete lessons under this unit
    await lesson_model_1.Lesson.deleteMany({ unitId: id });
    await unit.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Unit and all its lessons deleted successfully'));
});
