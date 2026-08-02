"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const progress_validation_1 = require("./progress.validation");
const progress_controller_1 = require("./progress.controller");
const router = (0, express_1.Router)();
// Progress tracking endpoints (requires student or admin/teacher authentication)
router.post('/', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: progress_validation_1.updateProgressSchema }), progress_controller_1.updateProgress);
router.get('/course/:courseId', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: progress_validation_1.courseIdParamSchema }), progress_controller_1.getCourseProgress);
// Achievements & Gamification endpoints
router.get('/achievements', authMiddleware_1.protect, progress_controller_1.getStudentAchievements);
router.post('/checkin', authMiddleware_1.protect, progress_controller_1.dailyCheckIn);
exports.default = router;
