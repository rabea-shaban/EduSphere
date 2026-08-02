"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const courseAdmin_controller_1 = require("./courseAdmin.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin only
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/', courseAdmin_controller_1.getAllCoursesAdmin);
router.get('/:id', courseAdmin_controller_1.getCourseByIdAdmin);
router.get('/:id/enrollments', courseAdmin_controller_1.getCourseEnrollmentsAdmin);
router.patch('/:id', courseAdmin_controller_1.updateCourseAdmin);
router.patch('/:id/approve', courseAdmin_controller_1.approveCourseAdmin);
router.patch('/:id/reject', courseAdmin_controller_1.rejectCourseAdmin);
router.patch('/:id/feature', courseAdmin_controller_1.featureCourseAdmin);
router.patch('/:id/status', courseAdmin_controller_1.changeCourseStatusAdmin);
router.delete('/:id', courseAdmin_controller_1.softDeleteCourseAdmin);
exports.default = router;
