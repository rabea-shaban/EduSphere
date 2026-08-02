"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const quiz_validation_1 = require("./quiz.validation");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
// Protected Routes for all authenticated users
router.use(authMiddleware_1.protect);
// ─── Quiz List & Create ───────────────────────────────────────────────────────
router.get('/', quiz_controller_1.getTeacherQuizzes);
router.get('/quizzes', quiz_controller_1.getTeacherQuizzes);
router.post('/', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: quiz_validation_1.createQuizSchema }), quiz_controller_1.createQuiz);
router.post('/quizzes', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: quiz_validation_1.createQuizSchema }), quiz_controller_1.createQuiz);
// ─── Question Reorder ─────────────────────────────────────────────────────────
router.patch('/questions/reorder', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: quiz_validation_1.reorderQuestionsSchema }), quiz_controller_1.reorderQuizQuestions);
router.patch('/quizzes/questions/reorder', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: quiz_validation_1.reorderQuestionsSchema }), quiz_controller_1.reorderQuizQuestions);
// ─── Single Quiz CRUD ─────────────────────────────────────────────────────────
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizById);
router.get('/quizzes/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizById);
router.put('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuizSchema }), quiz_controller_1.updateQuiz);
router.put('/quizzes/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuizSchema }), quiz_controller_1.updateQuiz);
router.patch('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuizSchema }), quiz_controller_1.updateQuiz);
router.patch('/quizzes/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuizSchema }), quiz_controller_1.updateQuiz);
router.delete('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.deleteQuiz);
router.delete('/quizzes/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.deleteQuiz);
// ─── Status Actions ───────────────────────────────────────────────────────────
router.patch('/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.publishQuiz);
router.patch('/quizzes/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.publishQuiz);
router.patch('/:id/unpublish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.unpublishQuiz);
router.patch('/quizzes/:id/unpublish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.unpublishQuiz);
router.patch('/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.archiveQuiz);
router.patch('/quizzes/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.archiveQuiz);
router.patch('/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.restoreQuiz);
router.patch('/quizzes/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.restoreQuiz);
router.post('/:id/duplicate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.duplicateQuiz);
router.post('/quizzes/:id/duplicate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.duplicateQuiz);
// ─── Question CRUD Sub-routes ─────────────────────────────────────────────────
router.get('/:id/questions', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizQuestions);
router.get('/quizzes/:id/questions', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizQuestions);
router.post('/:id/questions', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.createQuestionSchema }), quiz_controller_1.addQuizQuestion);
router.post('/quizzes/:id/questions', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.createQuestionSchema }), quiz_controller_1.addQuizQuestion);
router.put('/questions/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuestionSchema }), quiz_controller_1.updateQuizQuestion);
router.put('/quizzes/questions/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuestionSchema }), quiz_controller_1.updateQuizQuestion);
router.delete('/questions/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.deleteQuizQuestion);
router.delete('/quizzes/questions/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.deleteQuizQuestion);
// ─── Analytics & Leaderboard ──────────────────────────────────────────────────
router.get('/:id/analytics', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizAnalytics);
router.get('/quizzes/:id/analytics', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizAnalytics);
router.get('/:id/leaderboard', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizLeaderboard);
router.get('/quizzes/:id/leaderboard', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizLeaderboard);
exports.default = router;
