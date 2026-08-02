"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateSubject = exports.activateSubject = exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const slugify_1 = __importDefault(require("slugify"));
const subject_model_1 = require("./subject.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new Subject.
 */
exports.createSubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name } = req.body;
    const existingSubject = await subject_model_1.Subject.findOne({ name });
    if (existingSubject) {
        throw new ApiError_1.ApiError(400, 'Subject with this name already exists');
    }
    const subject = await subject_model_1.Subject.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, subject, 'Subject created successfully'));
});
/**
 * Get all Subjects with search, filtering, pagination, sorting, and population.
 */
exports.getAllSubjects = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, educationStage, isActive, sort, gradeId, teacherId } = req.query;
    const filter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { name: searchRegex },
            { slug: searchRegex },
            { description: searchRegex },
        ];
    }
    if (educationStage) {
        filter.educationStage = educationStage;
    }
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    }
    if (gradeId) {
        filter.grades = gradeId;
    }
    if (teacherId) {
        filter.teacherIds = teacherId;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    // Sorting
    let sortBy = { name: 1 };
    if (sort) {
        const sortParts = sort.split(':');
        sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }
    const subjects = await subject_model_1.Subject.find(filter)
        .populate('grades')
        .populate('teacherIds', '-password') // Exclude teacher password
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum);
    const total = await subject_model_1.Subject.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        subjects,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Subjects retrieved successfully'));
});
/**
 * Get Subject by ID.
 */
exports.getSubjectById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findById(id)
        .populate('grades')
        .populate('teacherIds', '-password');
    if (!subject) {
        throw new ApiError_1.ApiError(404, 'Subject not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subject, 'Subject retrieved successfully'));
});
/**
 * Update Subject details.
 */
exports.updateSubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findById(id);
    if (!subject) {
        throw new ApiError_1.ApiError(404, 'Subject not found');
    }
    const { name } = req.body;
    if (name && name !== subject.name) {
        const duplicate = await subject_model_1.Subject.findOne({ name });
        if (duplicate) {
            throw new ApiError_1.ApiError(400, 'Subject with this name already exists');
        }
        // Update slug as well
        subject.slug = (0, slugify_1.default)(name, { lower: true, strict: true });
    }
    Object.assign(subject, req.body);
    await subject.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subject, 'Subject updated successfully'));
});
/**
 * Delete Subject.
 */
exports.deleteSubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findByIdAndDelete(id);
    if (!subject) {
        throw new ApiError_1.ApiError(404, 'Subject not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Subject deleted successfully'));
});
/**
 * Activate Subject.
 */
exports.activateSubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!subject) {
        throw new ApiError_1.ApiError(404, 'Subject not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subject, 'Subject activated successfully'));
});
/**
 * Deactivate Subject.
 */
exports.deactivateSubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const subject = await subject_model_1.Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!subject) {
        throw new ApiError_1.ApiError(404, 'Subject not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, subject, 'Subject deactivated successfully'));
});
