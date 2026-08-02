"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const enrollment_validation_1 = require("./enrollment.validation");
const enrollment_controller_1 = require("./enrollment.controller");
const router = (0, express_1.Router)();
// Student-scoped routes
router.post('/enroll', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: enrollment_validation_1.enrollStudentSchema }), enrollment_controller_1.enrollStudent);
router.get('/my-courses', authMiddleware_1.protect, enrollment_controller_1.getMyCourses);
router.patch('/:id/cancel', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), enrollment_controller_1.cancelEnrollment);
// Admin & Teacher-scoped routes
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), enrollment_controller_1.getAllEnrollments);
router.patch('/:id/complete', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: enrollment_validation_1.updateEnrollmentSchema }), enrollment_controller_1.completeCourse);
exports.default = router;
