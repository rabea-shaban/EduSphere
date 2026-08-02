"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const lesson_validation_1 = require("./lesson.validation");
const lesson_controller_1 = require("./lesson.controller");
const router = (0, express_1.Router)();
// ─── Public / Student read routes ─────────────────────────────────────────────
router.get('/', lesson_controller_1.getAllLessons);
// ─── Protected Teacher / Admin routes ─────────────────────────────────────────
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
// Section-scoped lessons: GET & POST
router.get('/sections/:sectionId/lessons', lesson_controller_1.getLessonsBySection);
router.post('/sections/:sectionId/lessons', (0, validationMiddleware_1.validationMiddleware)({ body: lesson_validation_1.createLessonSchema }), lesson_controller_1.createLesson);
// Global teacher lessons search
router.get('/teacher/lessons', lesson_controller_1.searchTeacherLessons);
// Bulk reorder lessons (must come before /:id)
router.patch('/reorder', (0, validationMiddleware_1.validationMiddleware)({ body: lesson_validation_1.reorderLessonsSchema }), lesson_controller_1.reorderLessons);
router.patch('/teacher/lessons/reorder', (0, validationMiddleware_1.validationMiddleware)({ body: lesson_validation_1.reorderLessonsSchema }), lesson_controller_1.reorderLessons);
// Individual lesson routes
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.getLessonById);
router.get('/teacher/lessons/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.getLessonById);
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: lesson_validation_1.createLessonSchema }), lesson_controller_1.createLesson);
router.put('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: lesson_validation_1.updateLessonSchema }), lesson_controller_1.updateLesson);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: lesson_validation_1.updateLessonSchema }), lesson_controller_1.updateLesson);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.deleteLesson);
router.patch('/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.archiveLesson);
router.patch('/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.restoreLesson);
router.post('/:id/duplicate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), lesson_controller_1.duplicateLesson);
router.patch('/:id/move', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: lesson_validation_1.moveLessonSchema }), lesson_controller_1.moveLesson);
exports.default = router;
