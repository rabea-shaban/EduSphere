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

router.use(protect);

// ─── Teacher Analytics Endpoints (Supports both root & /teacher/analytics mounting) ──
router.get(['/dashboard', '/teacher/analytics/dashboard'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherDashboardAnalytics);
router.get(['/courses', '/teacher/analytics/courses'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCourseAnalytics);
router.get(['/students', '/teacher/analytics/students'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAnalytics);
router.get(['/lessons', '/teacher/analytics/lessons'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherLessonAnalytics);
router.get(['/quizzes', '/teacher/analytics/quizzes'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherQuizAnalytics);
router.get(['/assignments', '/teacher/analytics/assignments'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherAssignmentAnalytics);
router.get(['/revenue', '/teacher/analytics/revenue'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueAnalytics);
router.get(['/engagement', '/teacher/analytics/engagement'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEngagementAnalytics);
router.get(['/certificates', '/teacher/analytics/certificates'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCertificateAnalytics);
router.get(['/charts', '/teacher/analytics/charts'], restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherChartAnalytics);

// ─── Platform Admin Analytics Endpoints ───────────────────────────────────────
router.get(['/platform', '/analytics/platform'], restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);
router.get('/', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherDashboardAnalytics);

export default router;
