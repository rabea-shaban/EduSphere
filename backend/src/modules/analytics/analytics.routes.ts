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

// ─── Teacher Analytics Endpoints (Supports both root & /teacher/analytics mounting) ──
router.get(['/dashboard', '/teacher/analytics/dashboard'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherDashboardAnalytics);
router.get(['/courses', '/teacher/analytics/courses'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCourseAnalytics);
router.get(['/students', '/teacher/analytics/students'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAnalytics);
router.get(['/lessons', '/teacher/analytics/lessons'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherLessonAnalytics);
router.get(['/quizzes', '/teacher/analytics/quizzes'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherQuizAnalytics);
router.get(['/assignments', '/teacher/analytics/assignments'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherAssignmentAnalytics);
router.get(['/revenue', '/teacher/analytics/revenue'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueAnalytics);
router.get(['/engagement', '/teacher/analytics/engagement'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEngagementAnalytics);
router.get(['/certificates', '/teacher/analytics/certificates'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCertificateAnalytics);
router.get(['/charts', '/teacher/analytics/charts'], protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherChartAnalytics);

// ─── Platform Admin Analytics Endpoints ───────────────────────────────────────
router.get(['/platform', '/analytics/platform'], protect, restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);

export default router;
