"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubmissions = exports.gradeSubmission = exports.updateSubmission = exports.submitAssignment = void 0;
const submission_model_1 = require("./submission.model");
const assignment_model_1 = require("../assignments/assignment.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Student submits an assignment.
 * Validates assignment status, due date, late submission configurations, and double submissions.
 */
exports.submitAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { assignmentId, attachments, textAnswer } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // 1. Verify assignment exists and is active
    const assignment = await assignment_model_1.Assignment.findById(assignmentId);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    if (assignment.status === 'Closed') {
        throw new ApiError_1.ApiError(400, 'Submissions are closed for this assignment');
    }
    if (assignment.status !== 'Published') {
        throw new ApiError_1.ApiError(400, 'Cannot submit to an assignment that is not published');
    }
    // 2. Check for duplicate submission
    const existingSubmission = await submission_model_1.Submission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
        throw new ApiError_1.ApiError(400, 'You have already submitted this assignment. Use the update route to make changes.');
    }
    // 3. Date checks (Late submission locks)
    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);
    if (isLate && !assignment.allowLateSubmission) {
        throw new ApiError_1.ApiError(400, 'The due date has passed. Late submissions are not allowed for this assignment.');
    }
    const status = isLate ? 'Late' : 'Submitted';
    // 4. Create submission document
    const submission = await submission_model_1.Submission.create({
        assignmentId,
        studentId,
        attachments: attachments || [],
        textAnswer,
        submittedAt: now,
        status,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, submission, 'Assignment submitted successfully'));
});
/**
 * Student updates their submission before the due date.
 */
exports.updateSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // submission ID
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const submission = await submission_model_1.Submission.findById(id);
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    // Verify ownership
    if (submission.studentId.toString() !== studentId.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to modify this submission');
    }
    const assignment = await assignment_model_1.Assignment.findById(submission.assignmentId);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    // Lock edits if past due date
    if (new Date() > new Date(assignment.dueDate)) {
        throw new ApiError_1.ApiError(400, 'Cannot update submission. The assignment due date has passed.');
    }
    Object.assign(submission, req.body);
    submission.submittedAt = new Date(); // Update submission time
    await submission.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Submission updated successfully'));
});
/**
 * Teacher reviews and grades a submission.
 */
exports.gradeSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // submission ID
    const { grade, feedback } = req.body;
    const reviewerId = req.user?._id;
    if (!reviewerId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const submission = await submission_model_1.Submission.findById(id);
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    const assignment = await assignment_model_1.Assignment.findById(submission.assignmentId);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    // Validate grade limit
    if (grade > assignment.totalMarks) {
        throw new ApiError_1.ApiError(400, `Grade cannot exceed the assignment maximum marks of ${assignment.totalMarks}`);
    }
    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'Reviewed';
    submission.reviewedBy = reviewerId;
    submission.reviewedAt = new Date();
    await submission.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Submission graded and reviewed successfully'));
});
/**
 * Get student submission history/logs.
 */
exports.getStudentSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, assignmentId, studentId, status } = req.query;
    const filter = {};
    if (assignmentId)
        filter.assignmentId = assignmentId;
    if (status)
        filter.status = status;
    // Students can only view their own submissions
    if (req.user && req.user.role === 'STUDENT') {
        filter.studentId = req.user._id;
    }
    else if (studentId) {
        filter.studentId = studentId;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const submissions = await submission_model_1.Submission.find(filter)
        .populate('assignmentId', 'title totalMarks dueDate instructions')
        .populate('studentId', 'firstName lastName username email')
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
    }, 'Submissions history retrieved successfully'));
});
exports.default = exports.submitAssignment;
