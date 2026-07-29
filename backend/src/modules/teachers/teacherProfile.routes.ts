import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherAvatar,
  deleteTeacherAvatar,
  updateTeacherCover,
  deleteTeacherCover,
  changeTeacherPassword,
  updateTeacherEmail,
  getTeacherProfileCompleteness,
  getTeacherProfileAnalytics,
} from './teacherProfile.controller';

const router = Router();

// ─── Teacher Profile Endpoints (all require auth) ─────────────────────────────
router.get('/teacher/profile', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfile);
router.put('/teacher/profile', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherProfile);
router.patch('/teacher/profile/avatar', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherAvatar);
router.delete('/teacher/profile/avatar', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherAvatar);
router.patch('/teacher/profile/cover', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherCover);
router.delete('/teacher/profile/cover', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherCover);
router.patch('/teacher/profile/password', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), changeTeacherPassword);
router.patch('/teacher/profile/email', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherEmail);
router.get('/teacher/profile/completeness', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfileCompleteness);
router.get('/teacher/profile/analytics', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfileAnalytics);

export default router;
