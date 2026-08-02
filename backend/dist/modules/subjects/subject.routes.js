"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const subject_validation_1 = require("./subject.validation");
const subject_controller_1 = require("./subject.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, subject_controller_1.getAllSubjects);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subject_controller_1.getSubjectById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: subject_validation_1.createSubjectSchema }), subject_controller_1.createSubject);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: subject_validation_1.updateSubjectSchema }), subject_controller_1.updateSubject);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subject_controller_1.deleteSubject);
router.patch('/:id/activate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subject_controller_1.activateSubject);
router.patch('/:id/deactivate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), subject_controller_1.deactivateSubject);
exports.default = router;
