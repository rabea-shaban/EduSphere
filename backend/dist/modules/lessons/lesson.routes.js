"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const lesson_validation_1 = require("./lesson.validation");
const lesson_controller_1 = require("./lesson.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, lesson_controller_1.getAllLessons);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.getLessonById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: lesson_validation_1.createLessonSchema }), lesson_controller_1.createLesson);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: lesson_validation_1.updateLessonSchema }), lesson_controller_1.updateLesson);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.deleteLesson);
exports.default = router;
