"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const categoryAdmin_controller_1 = require("./categoryAdmin.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
// Categories Endpoints
router.get('/categories', categoryAdmin_controller_1.getAllCategoriesAdmin);
router.post('/categories', categoryAdmin_controller_1.createCategoryAdmin);
router.patch('/categories/:id', categoryAdmin_controller_1.updateCategoryAdmin);
router.delete('/categories/:id', categoryAdmin_controller_1.deleteCategoryAdmin);
// Subjects Endpoints
router.get('/subjects', categoryAdmin_controller_1.getAllSubjectsAdmin);
router.post('/subjects', categoryAdmin_controller_1.createSubjectAdmin);
router.patch('/subjects/:id', categoryAdmin_controller_1.updateSubjectAdmin);
router.delete('/subjects/:id', categoryAdmin_controller_1.deleteSubjectAdmin);
// Grades Endpoints
router.get('/grades', categoryAdmin_controller_1.getAllGradesAdmin);
router.post('/grades', categoryAdmin_controller_1.createGradeAdmin);
router.patch('/grades/:id', categoryAdmin_controller_1.updateGradeAdmin);
router.delete('/grades/:id', categoryAdmin_controller_1.deleteGradeAdmin);
exports.default = router;
