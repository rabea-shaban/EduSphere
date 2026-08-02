"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const course_validation_1 = require("./course.validation");
const course_controller_1 = require("./course.controller");
const router = (0, express_1.Router)();
// Read routes (public - no auth required)
router.get('/', course_controller_1.getAllCourses);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.getCourseById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: course_validation_1.createCourseSchema }), course_controller_1.createCourse);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: course_validation_1.updateCourseSchema }), course_controller_1.updateCourse);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.deleteCourse);
router.patch('/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.publishCourse);
router.patch('/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.archiveCourse);
router.patch('/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.restoreCourse);
router.post('/:id/duplicate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), course_controller_1.duplicateCourse);
exports.default = router;
