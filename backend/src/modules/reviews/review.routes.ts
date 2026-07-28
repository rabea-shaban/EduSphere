import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getCourseReviews,
  submitCourseReview,
  voteReviewHelpful,
  getTeacherReviews,
  getTeacherReviewAnalytics,
  postTeacherReply,
  deleteTeacherReply,
  flagReview,
  getModerationQueue,
  updateReviewStatus,
} from './review.controller';

const router = Router();

// Public / General Course Reviews
router.get('/courses/:courseId/reviews', getCourseReviews);

// Student Protected Actions
router.post('/courses/:courseId/reviews', protect, submitCourseReview);
router.post('/reviews/:id/helpful', protect, voteReviewHelpful);
router.post('/reviews/:id/flag', protect, flagReview);

// Teacher Protected Actions
router.get('/teacher/reviews', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherReviews);
router.get('/teacher/reviews/analytics', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherReviewAnalytics);
router.post('/teacher/reviews/:id/reply', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), postTeacherReply);
router.delete('/teacher/reviews/:id/reply', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherReply);

// Admin Moderation
router.get('/admin/reviews/moderation', protect, restrictTo('SUPER_ADMIN', 'ADMIN'), getModerationQueue);
router.patch('/admin/reviews/:id/status', protect, restrictTo('SUPER_ADMIN', 'ADMIN'), updateReviewStatus);

export default router;
