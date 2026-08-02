"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const answer_validation_1 = require("./answer.validation");
const answer_controller_1 = require("./answer.controller");
const router = (0, express_1.Router)();
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.patch('/:id/grade', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: answer_validation_1.gradeAnswerSchema }), answer_controller_1.gradeAnswer);
exports.default = router;
