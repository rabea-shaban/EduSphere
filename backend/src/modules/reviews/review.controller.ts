import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import ReviewManagementService from './services/reviewManagement.service';
import TeacherReplyService from './services/teacherReply.service';
import ReviewAnalyticsService from './services/reviewAnalytics.service';
import ModerationService from './services/moderation.service';

/**
 * GET /courses/:courseId/reviews
 */
export const getCourseReviews = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const { page = 1, limit = 10, starFilter } = req.query;

  const result = await ReviewManagementService.getCourseReviews(
    String(courseId),
    Number(page),
    Number(limit),
    starFilter ? Number(starFilter) : undefined
  );

  res.status(200).json(new ApiResponse(200, result, 'Course reviews retrieved successfully'));
});

/**
 * POST /courses/:courseId/reviews
 */
export const submitCourseReview = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const studentId = req.user!._id.toString();
  const studentName = `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email;
  const { rating, comment, title } = req.body;

  const review = await ReviewManagementService.submitReview(
    String(courseId),
    studentId,
    studentName,
    Number(rating),
    comment,
    title
  );

  res.status(201).json(new ApiResponse(201, review, 'تم إرسال تقييمك ومراجعتك بنجاح 🎉'));
});

/**
 * POST /reviews/:id/helpful
 */
export const voteReviewHelpful = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();

  const review = await ReviewManagementService.voteHelpful(String(id), userId);

  res.status(200).json(new ApiResponse(200, review, 'Helpful vote registered successfully'));
});

/**
 * GET /teacher/reviews
 */
export const getTeacherReviews = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const teacherId = req.user!._id.toString();
  const userRole = req.user!.role;
  const { page = 1, limit = 15, courseId, hasReply } = req.query;

  const hasReplyBool = hasReply === 'true' ? true : hasReply === 'false' ? false : undefined;

  const result = await ReviewManagementService.getTeacherReviews(
    teacherId,
    userRole,
    Number(page),
    Number(limit),
    courseId as string,
    hasReplyBool
  );

  res.status(200).json(new ApiResponse(200, result, 'Teacher reviews retrieved successfully'));
});

/**
 * GET /teacher/reviews/analytics
 */
export const getTeacherReviewAnalytics = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const teacherId = req.user!._id.toString();
  const userRole = req.user!.role;

  const analytics = await ReviewAnalyticsService.getTeacherReviewAnalytics(teacherId, userRole);

  res.status(200).json(new ApiResponse(200, analytics, 'Review analytics retrieved successfully'));
});

/**
 * POST /teacher/reviews/:id/reply
 */
export const postTeacherReply = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const teacherId = req.user!._id.toString();
  const userRole = req.user!.role;
  const { replyText } = req.body;

  const review = await TeacherReplyService.addOrUpdateReply(String(id), teacherId, userRole, replyText);

  res.status(200).json(new ApiResponse(200, review, 'تم حفظ رد المحاضر بنجاح 💬'));
});

/**
 * DELETE /teacher/reviews/:id/reply
 */
export const deleteTeacherReply = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const teacherId = req.user!._id.toString();
  const userRole = req.user!.role;

  const review = await TeacherReplyService.deleteReply(String(id), teacherId, userRole);

  res.status(200).json(new ApiResponse(200, review, 'تم حذف رد المحاضر بنجاح'));
});

/**
 * POST /reviews/:id/flag
 */
export const flagReview = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!._id.toString();
  const { reason } = req.body;

  const review = await ModerationService.flagReview(String(id), userId, reason);

  res.status(200).json(new ApiResponse(200, review, 'تم الإبلاغ عن المراجعة بنجاح وفي انتظار مراجعة الإدارة'));
});

/**
 * GET /admin/reviews/moderation
 */
export const getModerationQueue = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20 } = req.query;

  const result = await ModerationService.getModerationQueue(Number(page), Number(limit));

  res.status(200).json(new ApiResponse(200, result, 'Moderation queue retrieved successfully'));
});

/**
 * PATCH /admin/reviews/:id/status
 */
export const updateReviewStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const review = await ModerationService.updateStatus(String(id), status);

  res.status(200).json(new ApiResponse(200, review, `تم تحديث حالة المراجعة إلى ${status}`));
});
