"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const teacherProfile_controller_1 = require("./teacherProfile.controller");
const router = (0, express_1.Router)();
// ─── Teacher Profile Endpoints (all require auth) ─────────────────────────────
router.get('/teacher/profile', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.getTeacherProfile);
router.put('/teacher/profile', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.updateTeacherProfile);
router.patch('/teacher/profile/avatar', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.updateTeacherAvatar);
router.delete('/teacher/profile/avatar', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.deleteTeacherAvatar);
router.patch('/teacher/profile/cover', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.updateTeacherCover);
router.delete('/teacher/profile/cover', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.deleteTeacherCover);
router.patch('/teacher/profile/password', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.changeTeacherPassword);
router.patch('/teacher/profile/email', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.updateTeacherEmail);
router.get('/teacher/profile/completeness', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.getTeacherProfileCompleteness);
router.get('/teacher/profile/analytics', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), teacherProfile_controller_1.getTeacherProfileAnalytics);
exports.default = router;
