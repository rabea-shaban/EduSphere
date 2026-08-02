"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const submission_validation_1 = require("./submission.validation");
const submission_controller_1 = require("./submission.controller");
const router = (0, express_1.Router)();
// Student submission routes
router.post('/submit', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ body: submission_validation_1.submitAssignmentSchema }), submission_controller_1.submitAssignment);
router.patch('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: submission_validation_1.updateSubmissionSchema }), submission_controller_1.updateSubmission);
router.get('/history', authMiddleware_1.protect, submission_controller_1.getStudentSubmissions);
// Teacher grading routes
router.patch('/:id/grade', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: submission_validation_1.gradeSubmissionSchema }), submission_controller_1.gradeSubmission);
exports.default = router;
