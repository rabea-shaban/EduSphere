"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewStatus = exports.getModerationQueue = exports.flagReview = exports.deleteTeacherReply = exports.postTeacherReply = exports.getTeacherReviewAnalytics = exports.getTeacherReviews = exports.voteReviewHelpful = exports.submitCourseReview = exports.getCourseReviews = void 0;
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const reviewManagement_service_1 = __importDefault(require("./services/reviewManagement.service"));
const teacherReply_service_1 = __importDefault(require("./services/teacherReply.service"));
const reviewAnalytics_service_1 = __importDefault(require("./services/reviewAnalytics.service"));
const moderation_service_1 = __importDefault(require("./services/moderation.service"));
/**
 * GET /courses/:courseId/reviews
 */
exports.getCourseReviews = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    const { page = 1, limit = 10, starFilter } = req.query;
    const result = await reviewManagement_service_1.default.getCourseReviews(String(courseId), Number(page), Number(limit), starFilter ? Number(starFilter) : undefined);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Course reviews retrieved successfully'));
});
/**
 * POST /courses/:courseId/reviews
 */
exports.submitCourseReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id.toString();
    const studentName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { rating, comment, title } = req.body;
    const review = await reviewManagement_service_1.default.submitReview(String(courseId), studentId, studentName, Number(rating), comment, title);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, review, 'تم إرسال تقييمك ومراجعتك بنجاح 🎉'));
});
/**
 * POST /reviews/:id/helpful
 */
exports.voteReviewHelpful = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const review = await reviewManagement_service_1.default.voteHelpful(String(id), userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'Helpful vote registered successfully'));
});
/**
 * GET /teacher/reviews
 */
exports.getTeacherReviews = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherId = req.user._id.toString();
    const userRole = req.user.role;
    const { page = 1, limit = 15, courseId, hasReply } = req.query;
    const hasReplyBool = hasReply === 'true' ? true : hasReply === 'false' ? false : undefined;
    const result = await reviewManagement_service_1.default.getTeacherReviews(teacherId, userRole, Number(page), Number(limit), courseId, hasReplyBool);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Teacher reviews retrieved successfully'));
});
/**
 * GET /teacher/reviews/analytics
 */
exports.getTeacherReviewAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherId = req.user._id.toString();
    const userRole = req.user.role;
    const analytics = await reviewAnalytics_service_1.default.getTeacherReviewAnalytics(teacherId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, analytics, 'Review analytics retrieved successfully'));
});
/**
 * POST /teacher/reviews/:id/reply
 */
exports.postTeacherReply = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const teacherId = req.user._id.toString();
    const userRole = req.user.role;
    const { replyText } = req.body;
    const review = await teacherReply_service_1.default.addOrUpdateReply(String(id), teacherId, userRole, replyText);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'تم حفظ رد المحاضر بنجاح 💬'));
});
/**
 * DELETE /teacher/reviews/:id/reply
 */
exports.deleteTeacherReply = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const teacherId = req.user._id.toString();
    const userRole = req.user.role;
    const review = await teacherReply_service_1.default.deleteReply(String(id), teacherId, userRole);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'تم حذف رد المحاضر بنجاح'));
});
/**
 * POST /reviews/:id/flag
 */
exports.flagReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const { reason } = req.body;
    const review = await moderation_service_1.default.flagReview(String(id), userId, reason);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, 'تم الإبلاغ عن المراجعة بنجاح وفي انتظار مراجعة الإدارة'));
});
/**
 * GET /admin/reviews/moderation
 */
exports.getModerationQueue = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await moderation_service_1.default.getModerationQueue(Number(page), Number(limit));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Moderation queue retrieved successfully'));
});
/**
 * PATCH /admin/reviews/:id/status
 */
exports.updateReviewStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const review = await moderation_service_1.default.updateStatus(String(id), status);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, review, `تم تحديث حالة المراجعة إلى ${status}`));
});
