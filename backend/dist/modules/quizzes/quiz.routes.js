"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const quiz_validation_1 = require("./quiz.validation");
const quiz_controller_1 = require("./quiz.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, quiz_controller_1.getAllQuizzes);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizById);
router.get('/:id/leaderboard', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.getQuizLeaderboard);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: quiz_validation_1.createQuizSchema }), quiz_controller_1.createQuiz);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: quiz_validation_1.updateQuizSchema }), quiz_controller_1.updateQuiz);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), quiz_controller_1.deleteQuiz);
exports.default = router;
