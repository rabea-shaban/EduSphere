"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const questionBank_validation_1 = require("./questionBank.validation");
const questionBank_controller_1 = require("./questionBank.controller");
const router = (0, express_1.Router)();
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.get('/random', questionBank_controller_1.getRandomQuestions);
router.get('/', questionBank_controller_1.getAllQuestions);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), questionBank_controller_1.getQuestionById);
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: questionBank_validation_1.createQuestionBankSchema }), questionBank_controller_1.createQuestion);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: questionBank_validation_1.updateQuestionBankSchema }), questionBank_controller_1.updateQuestion);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), questionBank_controller_1.deleteQuestion);
exports.default = router;
