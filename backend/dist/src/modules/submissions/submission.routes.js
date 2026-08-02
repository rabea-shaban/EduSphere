"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const submission_controller_1 = require("./submission.controller");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
// Student Submissions Routes
router.post('/', submission_controller_1.submitAssignment);
router.post('/submit', submission_controller_1.submitAssignment);
router.post('/submissions/submit', submission_controller_1.submitAssignment);
router.put('/:id', submission_controller_1.updateSubmission);
router.get('/history', submission_controller_1.getStudentSubmissions);
// Teacher & Admin Grading Routes
router.get('/teacher/submissions/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), submission_controller_1.getSubmissionById);
router.get('/:id', submission_controller_1.getSubmissionById);
router.patch('/:id/grade', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), submission_controller_1.gradeSubmission);
router.patch('/teacher/submissions/:id/grade', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), submission_controller_1.gradeSubmission);
router.patch('/:id/feedback', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), submission_controller_1.addSubmissionFeedback);
router.patch('/teacher/submissions/:id/feedback', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), submission_controller_1.addSubmissionFeedback);
exports.default = router;
