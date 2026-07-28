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

router.use(protect);

// ─── Teacher Profile Endpoints ────────────────────────────────────────────────
router.get('/teacher/profile', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfile);
router.put('/teacher/profile', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherProfile);
router.patch('/teacher/profile/avatar', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherAvatar);
router.delete('/teacher/profile/avatar', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherAvatar);
router.patch('/teacher/profile/cover', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherCover);
router.delete('/teacher/profile/cover', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), deleteTeacherCover);
router.patch('/teacher/profile/password', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), changeTeacherPassword);
router.patch('/teacher/profile/email', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), updateTeacherEmail);
router.get('/teacher/profile/completeness', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfileCompleteness);
router.get('/teacher/profile/analytics', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherProfileAnalytics);

export default router;
