"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentSubmissions = exports.closeAssignment = exports.publishAssignment = exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentById = exports.getAllAssignments = exports.createAssignment = void 0;
const assignment_model_1 = require("./assignment.model");
const submission_model_1 = require("../submissions/submission.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new assignment.
 */
exports.createAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const assignmentData = { ...req.body };
    if (!assignmentData.teacherId && req.user) {
        assignmentData.teacherId = req.user._id;
    }
    const assignment = await assignment_model_1.Assignment.create(assignmentData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, assignment, 'Assignment created successfully'));
});
/**
 * Get all assignments with search, pagination, and filters.
 */
exports.getAllAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, courseId, unitId, lessonId, status } = req.query;
    const filter = { deletedAt: null };
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (courseId)
        filter.courseId = courseId;
    if (unitId)
        filter.unitId = unitId;
    if (lessonId)
        filter.lessonId = lessonId;
    if (status)
        filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const assignments = await assignment_model_1.Assignment.find(filter)
        .populate('courseId', 'title slug')
        .populate('unitId', 'title')
        .populate('lessonId', 'title')
        .populate('teacherId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await assignment_model_1.Assignment.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        assignments,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Assignments retrieved successfully'));
});
/**
 * Get Assignment by ID.
 */
exports.getAssignmentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const assignment = await assignment_model_1.Assignment.findById(id)
        .populate('courseId', 'title slug')
        .populate('unitId', 'title')
        .populate('lessonId', 'title')
        .populate('teacherId', 'firstName lastName email');
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment retrieved successfully'));
});
/**
 * Update Assignment.
 */
exports.updateAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const assignment = await assignment_model_1.Assignment.findById(id);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    // Ownership validation for teachers
    if (req.user && req.user.role === 'TEACHER' && assignment.teacherId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to modify this assignment');
    }
    Object.assign(assignment, req.body);
    await assignment.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment updated successfully'));
});
/**
 * Soft delete an assignment.
 */
exports.deleteAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const assignment = await assignment_model_1.Assignment.findById(id);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    // Ownership validation for teachers
    if (req.user && req.user.role === 'TEACHER' && assignment.teacherId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to delete this assignment');
    }
    assignment.deletedAt = new Date();
    await assignment.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Assignment soft-deleted successfully'));
});
/**
 * Publish Assignment.
 */
exports.publishAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const assignment = await assignment_model_1.Assignment.findByIdAndUpdate(id, { status: 'Published' }, { new: true });
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment published successfully'));
});
/**
 * Close Assignment.
 */
exports.closeAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const assignment = await assignment_model_1.Assignment.findByIdAndUpdate(id, { status: 'Closed' }, { new: true });
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, assignment, 'Assignment closed successfully'));
});
/**
 * View submissions under an assignment (Teachers/Admins only).
 */
exports.getAssignmentSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // assignment ID
    const { page = 1, limit = 10, status } = req.query;
    const assignment = await assignment_model_1.Assignment.findById(id);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    const filter = { assignmentId: id };
    if (status) {
        filter.status = status;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const submissions = await submission_model_1.Submission.find(filter)
        .populate('studentId', 'firstName lastName username email avatar')
        .populate('reviewedBy', 'firstName lastName')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await submission_model_1.Submission.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        submissions,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Submissions for assignment retrieved successfully'));
});
