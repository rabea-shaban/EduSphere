"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const teacherApplication_validation_1 = require("./teacherApplication.validation");
const teacherApplication_controller_1 = require("./teacherApplication.controller");
const router = (0, express_1.Router)();
// ─── Public endpoints ─────────────────────────────────────────────────────────
router.post('/check-status', teacherApplication_controller_1.checkStatusByQuery);
router.get('/check-status', teacherApplication_controller_1.checkStatusByQuery);
// ─── Teacher-facing endpoints (Optional or Authenticated) ──────────────────────
// POST /teacher/apply → submit or save draft (protectOptional allows guest + auth submission)
router.post('/', authMiddleware_1.protectOptional, (0, validationMiddleware_1.validationMiddleware)({ body: teacherApplication_validation_1.createTeacherApplicationSchema }), teacherApplication_controller_1.submitApplication);
// Save draft (relaxed validation)
router.post('/draft', authMiddleware_1.protectOptional, (0, validationMiddleware_1.validationMiddleware)({ body: teacherApplication_validation_1.saveDraftApplicationSchema }), teacherApplication_controller_1.submitApplication);
// GET own application status
router.get('/my-application', authMiddleware_1.protect, teacherApplication_controller_1.getMyApplication);
// Legacy alias
router.get('/my-status', authMiddleware_1.protect, teacherApplication_controller_1.getMyApplication);
// Update own application (edit Draft / NeedsChanges / Rejected)
router.put('/my-application', authMiddleware_1.protect, teacherApplication_controller_1.updateMyApplication);
// Delete own draft
router.delete('/my-application', authMiddleware_1.protect, teacherApplication_controller_1.deleteMyApplication);
// ─── Admin-only endpoints ─────────────────────────────────────────────────────
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/', teacherApplication_controller_1.getAllApplications);
router.post('/bulk-approve', teacherApplication_controller_1.bulkApproveApplications);
router.post('/bulk-reject', teacherApplication_controller_1.bulkRejectApplications);
router.get('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), teacherApplication_controller_1.getApplicationById);
// Separate action endpoints (enterprise style)
router.patch('/:id/approve', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: teacherApplication_validation_1.approveApplicationSchema }), teacherApplication_controller_1.approveApplication);
router.patch('/:id/reject', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: teacherApplication_validation_1.rejectApplicationSchema }), teacherApplication_controller_1.rejectApplication);
router.patch('/:id/request-changes', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: teacherApplication_validation_1.requestChangesSchema }), teacherApplication_controller_1.requestChanges);
// Generic status update (backward compat)
router.patch('/:id/status', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: teacherApplication_validation_1.updateApplicationStatusSchema }), teacherApplication_controller_1.updateApplicationStatus);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), teacherApplication_controller_1.deleteApplication);
exports.default = router;
