"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const question_validation_1 = require("./question.validation");
const question_controller_1 = require("./question.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, question_controller_1.getQuizQuestions);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), question_controller_1.getQuizQuestionById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: question_validation_1.createQuizQuestionSchema }), question_controller_1.createQuizQuestion);
router.post('/bulk', (0, validationMiddleware_1.validationMiddleware)({ body: question_validation_1.bulkAddQuizQuestionsSchema }), question_controller_1.bulkAddQuestions);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: question_validation_1.updateQuizQuestionSchema }), question_controller_1.updateQuizQuestion);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), question_controller_1.deleteQuizQuestion);
exports.default = router;
