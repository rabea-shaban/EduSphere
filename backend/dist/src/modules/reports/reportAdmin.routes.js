"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const reportAdmin_controller_1 = require("./reportAdmin.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/reports/dashboard', reportAdmin_controller_1.getReportsDashboardAdmin);
router.get('/reports/revenue', reportAdmin_controller_1.getRevenueReportAdmin);
router.get('/reports/students', reportAdmin_controller_1.getStudentReportAdmin);
router.get('/reports/teachers', reportAdmin_controller_1.getTeacherReportAdmin);
exports.default = router;
