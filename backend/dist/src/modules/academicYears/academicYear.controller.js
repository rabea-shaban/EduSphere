"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAcademicYear = exports.activateAcademicYear = exports.deleteAcademicYear = exports.updateAcademicYear = exports.getAcademicYearById = exports.getAllAcademicYears = exports.createAcademicYear = void 0;
const academicYear_model_1 = require("./academicYear.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Academic Year.
 */
exports.createAcademicYear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title } = req.body;
    const existingYear = await academicYear_model_1.AcademicYear.findOne({ title });
    if (existingYear) {
        throw new ApiError_1.ApiError(400, 'Academic year with this title already exists');
    }
    const year = await academicYear_model_1.AcademicYear.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, year, 'Academic Year created successfully'));
});
/**
 * Get all Academic Years with search, pagination, sorting, and status filters.
 */
exports.getAllAcademicYears = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, status, sort, isCurrent } = req.query;
    const filter = {};
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (status) {
        filter.status = status;
    }
    if (isCurrent !== undefined) {
        filter.isCurrent = isCurrent === 'true';
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const years = await academicYear_model_1.AcademicYear.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
    const total = await academicYear_model_1.AcademicYear.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        academicYears: years,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Academic Years retrieved successfully'));
});
/**
 * Get Academic Year by ID.
 */
exports.getAcademicYearById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const year = await academicYear_model_1.AcademicYear.findById(id);
    if (!year) {
        throw new ApiError_1.ApiError(404, 'Academic Year not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, year, 'Academic Year retrieved successfully'));
});
/**
 * Update Academic Year details.
 */
exports.updateAcademicYear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const year = await academicYear_model_1.AcademicYear.findById(id);
    if (!year) {
        throw new ApiError_1.ApiError(404, 'Academic Year not found');
    }
    const { title } = req.body;
    if (title && title !== year.title) {
        const duplicateTitle = await academicYear_model_1.AcademicYear.findOne({ title });
        if (duplicateTitle) {
            throw new ApiError_1.ApiError(400, 'Academic year with this title already exists');
        }
    }
    // Update properties and save (triggers hooks)
    Object.assign(year, req.body);
    await year.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, year, 'Academic Year updated successfully'));
});
/**
 * Delete Academic Year.
 */
exports.deleteAcademicYear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const year = await academicYear_model_1.AcademicYear.findByIdAndDelete(id);
    if (!year) {
        throw new ApiError_1.ApiError(404, 'Academic Year not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Academic Year deleted successfully'));
});
/**
 * Activate an Academic Year.
 */
exports.activateAcademicYear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const year = await academicYear_model_1.AcademicYear.findById(id);
    if (!year) {
        throw new ApiError_1.ApiError(404, 'Academic Year not found');
    }
    year.status = 'ACTIVE';
    await year.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, year, 'Academic Year activated successfully'));
});
/**
 * Deactivate an Academic Year.
 */
exports.deactivateAcademicYear = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const year = await academicYear_model_1.AcademicYear.findById(id);
    if (!year) {
        throw new ApiError_1.ApiError(404, 'Academic Year not found');
    }
    year.status = 'INACTIVE';
    await year.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, year, 'Academic Year deactivated successfully'));
});
