"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateGrade = exports.activateGrade = exports.deleteGrade = exports.updateGrade = exports.getGradeById = exports.getAllGrades = exports.createGrade = void 0;
const grade_model_1 = require("./grade.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Grade.
 */
exports.createGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, order } = req.body;
    // Check unique constraints
    const duplicate = await grade_model_1.Grade.findOne({
        $or: [{ 'name.ar': name.ar }, { 'name.en': name.en }, { order }],
    });
    if (duplicate) {
        if (duplicate.name.ar === name.ar) {
            throw new ApiError_1.ApiError(400, 'Arabic grade name already exists');
        }
        if (duplicate.name.en === name.en) {
            throw new ApiError_1.ApiError(400, 'English grade name already exists');
        }
        if (duplicate.order === order) {
            throw new ApiError_1.ApiError(400, 'Grade order already taken');
        }
    }
    const grade = await grade_model_1.Grade.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, grade, 'Grade created successfully'));
});
/**
 * Get all Grades with filtering, search, pagination, and sorting.
 */
exports.getAllGrades = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, educationStage, isActive, sort } = req.query;
    const filter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { 'name.ar': searchRegex },
            { 'name.en': searchRegex },
            { description: searchRegex },
        ];
    }
    if (educationStage) {
        filter.educationStage = educationStage;
    }
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
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
    const grades = await grade_model_1.Grade.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
    const total = await grade_model_1.Grade.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        grades,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Grades retrieved successfully'));
});
/**
 * Get Grade by ID.
 */
exports.getGradeById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findById(id);
    if (!grade) {
        throw new ApiError_1.ApiError(404, 'Grade not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grade, 'Grade retrieved successfully'));
});
/**
 * Update Grade details.
 */
exports.updateGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findById(id);
    if (!grade) {
        throw new ApiError_1.ApiError(404, 'Grade not found');
    }
    const { name, order } = req.body;
    const orConditions = [];
    if (name?.ar && name.ar !== grade.name.ar) {
        orConditions.push({ 'name.ar': name.ar });
    }
    if (name?.en && name.en !== grade.name.en) {
        orConditions.push({ 'name.en': name.en });
    }
    if (order && order !== grade.order) {
        orConditions.push({ order });
    }
    if (orConditions.length > 0) {
        const duplicate = await grade_model_1.Grade.findOne({ $or: orConditions });
        if (duplicate) {
            if (name?.ar && duplicate.name.ar === name.ar) {
                throw new ApiError_1.ApiError(400, 'Arabic grade name already exists');
            }
            if (name?.en && duplicate.name.en === name.en) {
                throw new ApiError_1.ApiError(400, 'English grade name already exists');
            }
            if (order && duplicate.order === order) {
                throw new ApiError_1.ApiError(400, 'Grade order already taken');
            }
        }
    }
    Object.assign(grade, req.body);
    await grade.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grade, 'Grade updated successfully'));
});
/**
 * Delete Grade.
 */
exports.deleteGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findByIdAndDelete(id);
    if (!grade) {
        throw new ApiError_1.ApiError(404, 'Grade not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Grade deleted successfully'));
});
/**
 * Activate Grade.
 */
exports.activateGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!grade) {
        throw new ApiError_1.ApiError(404, 'Grade not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grade, 'Grade activated successfully'));
});
/**
 * Deactivate Grade.
 */
exports.deactivateGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const grade = await grade_model_1.Grade.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!grade) {
        throw new ApiError_1.ApiError(404, 'Grade not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, grade, 'Grade deactivated successfully'));
});
