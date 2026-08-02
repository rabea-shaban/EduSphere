import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getPlatformAnalytics,
  getTeacherDashboardAnalytics,
  getTeacherCourseAnalytics,
  getTeacherStudentAnalytics,
  getTeacherLessonAnalytics,
  getTeacherQuizAnalytics,
  getTeacherAssignmentAnalytics,
  getTeacherRevenueAnalytics,
  getTeacherEngagementAnalytics,
  getTeacherCertificateAnalytics,
  getTeacherChartAnalytics,
} from './analytics.controller';

const router = Router();

// ─── Teacher Analytics Endpoints (Supports both /analytics & /teacher/analytics mounting) ──
router.get(['/teacher/analytics/dashboard', '/analytics/dashboard', '/teacher/analytics'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherDashboardAnalytics);
router.get(['/teacher/analytics/courses', '/analytics/courses'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCourseAnalytics);
router.get(['/teacher/analytics/students', '/analytics/students'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAnalytics);
router.get(['/teacher/analytics/lessons', '/analytics/lessons'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherLessonAnalytics);
router.get(['/teacher/analytics/quizzes', '/analytics/quizzes'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherQuizAnalytics);
router.get(['/teacher/analytics/assignments', '/analytics/assignments'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherAssignmentAnalytics);
router.get(['/teacher/analytics/revenue', '/analytics/revenue'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueAnalytics);
router.get(['/teacher/analytics/engagement', '/analytics/engagement'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEngagementAnalytics);
router.get(['/teacher/analytics/certificates', '/analytics/certificates'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCertificateAnalytics);
router.get(['/teacher/analytics/charts', '/analytics/charts'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherChartAnalytics);

// ─── Platform Admin Analytics Endpoints ───────────────────────────────────────
router.get(['/platform', '/analytics/platform'], protect, restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);

export default router;
