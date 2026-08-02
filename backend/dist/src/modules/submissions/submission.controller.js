"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubmissions = exports.addSubmissionFeedback = exports.gradeSubmission = exports.updateSubmission = exports.submitAssignment = exports.getSubmissionById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const submission_model_1 = require("./submission.model");
const assignment_model_1 = require("../assignments/assignment.model");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
// ─── Helpers ────────────────────────────────────────────────────────────────
async function logActivity(userId, userName, userRole, action, details) {
    await activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Course',
        module: 'Submissions',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
// ─── Controller Handlers ─────────────────────────────────────────────────────
/**
 * GET /teacher/submissions/:id
 */
exports.getSubmissionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const submission = await submission_model_1.Submission.findById(id)
        .populate('assignmentId', 'title totalMarks passingMarks dueDate instructions submissionType')
        .populate('studentId', 'firstName lastName username email avatar')
        .populate('reviewedBy', 'firstName lastName');
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Submission retrieved successfully'));
});
/**
 * Student submits an assignment.
 */
exports.submitAssignment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { assignmentId, attachments, textAnswer, externalUrl } = req.body;
    const studentId = req.user?._id;
    const userName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.user?.email || '';
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
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
    const existingSubmission = await submission_model_1.Submission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
        throw new ApiError_1.ApiError(400, 'You have already submitted this assignment. Use update endpoint to resubmit.');
    }
    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);
    if (isLate && !assignment.allowLateSubmission) {
        throw new ApiError_1.ApiError(400, 'The due date has passed. Late submissions are not allowed for this assignment.');
    }
    const status = isLate ? 'Late' : 'Submitted';
    const submission = await submission_model_1.Submission.create({
        assignmentId,
        studentId,
        attachments: attachments || [],
        textAnswer,
        externalUrl,
        submittedAt: now,
        status,
        attemptNumber: 1,
    });
    await logActivity(studentId.toString(), userName, req.user?.role || 'STUDENT', 'SUBMISSION_CREATED', {
        submissionId: submission._id,
        assignmentId,
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, submission, 'Assignment submitted successfully'));
});
/**
 * Student updates their submission.
 */
exports.updateSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const studentId = req.user?._id;
    const userName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.user?.email || '';
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const submission = await submission_model_1.Submission.findById(id);
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    if (submission.studentId.toString() !== studentId.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to modify this submission');
    }
    const assignment = await assignment_model_1.Assignment.findById(submission.assignmentId);
    if (!assignment) {
        throw new ApiError_1.ApiError(404, 'Assignment not found');
    }
    if (new Date() > new Date(assignment.dueDate) && !assignment.allowLateSubmission) {
        throw new ApiError_1.ApiError(400, 'Cannot update submission. The assignment due date has passed.');
    }
    Object.assign(submission, req.body);
    submission.submittedAt = new Date();
    submission.attemptNumber = (submission.attemptNumber || 1) + 1;
    await submission.save();
    await logActivity(studentId.toString(), userName, req.user?.role || 'STUDENT', 'SUBMISSION_UPDATED', {
        submissionId: submission._id,
        attemptNumber: submission.attemptNumber,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Submission updated successfully'));
});
/**
 * Teacher grades a submission.
 */
exports.gradeSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { grade, feedback, privateNotes, publicFeedback, gradeOverride } = req.body;
    const reviewerId = req.user?._id;
    const userName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.user?.email || '';
    const userRole = req.user?.role || 'TEACHER';
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
    if (grade > assignment.totalMarks && !gradeOverride) {
        throw new ApiError_1.ApiError(400, `Grade cannot exceed maximum marks of ${assignment.totalMarks}`);
    }
    submission.grade = grade;
    if (feedback !== undefined)
        submission.feedback = feedback;
    if (privateNotes !== undefined)
        submission.privateNotes = privateNotes;
    if (publicFeedback !== undefined)
        submission.publicFeedback = publicFeedback;
    if (gradeOverride !== undefined)
        submission.gradeOverride = gradeOverride;
    submission.status = 'Reviewed';
    submission.reviewedBy = reviewerId;
    submission.reviewedAt = new Date();
    await submission.save();
    await logActivity(reviewerId.toString(), userName, userRole, 'SUBMISSION_GRADED', {
        submissionId: submission._id,
        grade,
        studentId: submission.studentId,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Submission graded successfully'));
});
/**
 * Teacher adds feedback to submission.
 */
exports.addSubmissionFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { feedback, privateNotes } = req.body;
    const reviewerId = req.user?._id;
    const userName = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.user?.email || '';
    const userRole = req.user?.role || 'TEACHER';
    if (!reviewerId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const submission = await submission_model_1.Submission.findById(id);
    if (!submission) {
        throw new ApiError_1.ApiError(404, 'Submission not found');
    }
    if (feedback !== undefined)
        submission.feedback = feedback;
    if (privateNotes !== undefined)
        submission.privateNotes = privateNotes;
    await submission.save();
    await logActivity(reviewerId.toString(), userName, userRole, 'FEEDBACK_ADDED', {
        submissionId: submission._id,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, submission, 'Feedback added successfully'));
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
