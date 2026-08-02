"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const assignment_validation_1 = require("./assignment.validation");
const assignment_controller_1 = require("./assignment.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, assignment_controller_1.getAllAssignments);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), assignment_controller_1.getAssignmentById);
// Write routes (admins and teachers only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: assignment_validation_1.createAssignmentSchema }), assignment_controller_1.createAssignment);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: assignment_validation_1.updateAssignmentSchema }), assignment_controller_1.updateAssignment);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), assignment_controller_1.deleteAssignment);
router.patch('/:id/publish', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), assignment_controller_1.publishAssignment);
router.patch('/:id/close', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), assignment_controller_1.closeAssignment);
router.get('/:id/submissions', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), assignment_controller_1.getAssignmentSubmissions);
exports.default = router;
