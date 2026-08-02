"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const examAttempt_validation_1 = require("./examAttempt.validation");
const examAttempt_controller_1 = require("./examAttempt.controller");
const router = (0, express_1.Router)();
// Student attempt routes
router.post('/start', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: examAttempt_validation_1.startAttemptSchema }), examAttempt_controller_1.startAttempt);
router.post('/:id/submit', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: examAttempt_validation_1.submitAttemptSchema }), examAttempt_controller_1.submitAttempt);
router.get('/history', authMiddleware_1.protect, examAttempt_controller_1.getStudentAttempts);
// Admin & Teacher endpoints
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), examAttempt_controller_1.getAllAttempts);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), examAttempt_controller_1.getAttemptDetails);
exports.default = router;
