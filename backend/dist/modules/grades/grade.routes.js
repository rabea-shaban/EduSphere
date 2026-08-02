"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const grade_validation_1 = require("./grade.validation");
const grade_controller_1 = require("./grade.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, grade_controller_1.getAllGrades);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), grade_controller_1.getGradeById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: grade_validation_1.createGradeSchema }), grade_controller_1.createGrade);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: grade_validation_1.updateGradeSchema }), grade_controller_1.updateGrade);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), grade_controller_1.deleteGrade);
router.patch('/:id/activate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), grade_controller_1.activateGrade);
router.patch('/:id/deactivate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), grade_controller_1.deactivateGrade);
exports.default = router;
