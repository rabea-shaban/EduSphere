"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
// ─── Teacher Analytics Endpoints (Supports both /analytics & /teacher/analytics mounting) ──
router.get(['/teacher/analytics/dashboard', '/analytics/dashboard', '/teacher/analytics'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherDashboardAnalytics);
router.get(['/teacher/analytics/courses', '/analytics/courses'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherCourseAnalytics);
router.get(['/teacher/analytics/students', '/analytics/students'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherStudentAnalytics);
router.get(['/teacher/analytics/lessons', '/analytics/lessons'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherLessonAnalytics);
router.get(['/teacher/analytics/quizzes', '/analytics/quizzes'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherQuizAnalytics);
router.get(['/teacher/analytics/assignments', '/analytics/assignments'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherAssignmentAnalytics);
router.get(['/teacher/analytics/revenue', '/analytics/revenue'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherRevenueAnalytics);
router.get(['/teacher/analytics/engagement', '/analytics/engagement'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherEngagementAnalytics);
router.get(['/teacher/analytics/certificates', '/analytics/certificates'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherCertificateAnalytics);
router.get(['/teacher/analytics/charts', '/analytics/charts'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), analytics_controller_1.getTeacherChartAnalytics);
// ─── Platform Admin Analytics Endpoints ───────────────────────────────────────
router.get(['/platform', '/analytics/platform'], authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), analytics_controller_1.getPlatformAnalytics);
exports.default = router;
