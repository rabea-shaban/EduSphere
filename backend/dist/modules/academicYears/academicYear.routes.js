"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const academicYear_validation_1 = require("./academicYear.validation");
const academicYear_controller_1 = require("./academicYear.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, academicYear_controller_1.getAllAcademicYears);
router.get('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), academicYear_controller_1.getAcademicYearById);
// Write routes (admins only)
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.post('/', (0, validationMiddleware_1.validationMiddleware)({ body: academicYear_validation_1.createAcademicYearSchema }), academicYear_controller_1.createAcademicYear);
router.patch('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: academicYear_validation_1.updateAcademicYearSchema }), academicYear_controller_1.updateAcademicYear);
router.delete('/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), academicYear_controller_1.deleteAcademicYear);
router.patch('/:id/activate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), academicYear_controller_1.activateAcademicYear);
router.patch('/:id/deactivate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), academicYear_controller_1.deactivateAcademicYear);
exports.default = router;
