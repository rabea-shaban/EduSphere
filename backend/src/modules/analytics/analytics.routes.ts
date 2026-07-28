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

// ─── Teacher Analytics Endpoints ──────────────────────────────────────────────
router.get('/teacher/analytics/dashboard', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherDashboardAnalytics);
router.get('/teacher/analytics/courses', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCourseAnalytics);
router.get('/teacher/analytics/students', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAnalytics);
router.get('/teacher/analytics/lessons', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherLessonAnalytics);
router.get('/teacher/analytics/quizzes', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherQuizAnalytics);
router.get('/teacher/analytics/assignments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherAssignmentAnalytics);
router.get('/teacher/analytics/revenue', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherRevenueAnalytics);
router.get('/teacher/analytics/engagement', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherEngagementAnalytics);
router.get('/teacher/analytics/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherCertificateAnalytics);
router.get('/teacher/analytics/charts', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherChartAnalytics);

// ─── Platform Admin Analytics Endpoints ───────────────────────────────────────
router.get('/platform', restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);
router.get('/', restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);

export default router;
