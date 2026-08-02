"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
// Public / General Course Reviews
router.get('/courses/:courseId/reviews', review_controller_1.getCourseReviews);
// Student Protected Actions
router.post('/courses/:courseId/reviews', authMiddleware_1.protect, review_controller_1.submitCourseReview);
router.post('/reviews/:id/helpful', authMiddleware_1.protect, review_controller_1.voteReviewHelpful);
router.post('/reviews/:id/flag', authMiddleware_1.protect, review_controller_1.flagReview);
// Teacher Protected Actions
router.get('/teacher/reviews', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), review_controller_1.getTeacherReviews);
router.get('/teacher/reviews/analytics', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), review_controller_1.getTeacherReviewAnalytics);
router.post('/teacher/reviews/:id/reply', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), review_controller_1.postTeacherReply);
router.delete('/teacher/reviews/:id/reply', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), review_controller_1.deleteTeacherReply);
// Admin Moderation
router.get('/admin/reviews/moderation', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), review_controller_1.getModerationQueue);
router.patch('/admin/reviews/:id/status', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), review_controller_1.updateReviewStatus);
exports.default = router;
