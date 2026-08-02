"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const section_validation_1 = require("./section.validation");
const section_controller_1 = require("./section.controller");
const router = (0, express_1.Router)();
// ─── All section routes require authentication ────────────────────────────────
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
// ─── Course-scoped section routes ────────────────────────────────────────────
// GET    /teacher/courses/:courseId/sections
router.get('/courses/:courseId/sections', section_controller_1.getSectionsByCourse);
// POST   /teacher/courses/:courseId/sections
router.post('/courses/:courseId/sections', (0, validationMiddleware_1.validationMiddleware)({ body: section_validation_1.createSectionSchema }), section_controller_1.createSection);
// ─── Global section search ───────────────────────────────────────────────────
// GET    /teacher/sections  (search across teacher's own sections)
router.get('/sections', section_controller_1.searchTeacherSections);
// ─── Bulk reorder (must come BEFORE /:id routes to avoid conflict) ───────────
// PATCH  /teacher/sections/reorder
router.patch('/sections/reorder', (0, validationMiddleware_1.validationMiddleware)({ body: section_validation_1.reorderSectionsSchema }), section_controller_1.reorderSections);
// ─── Individual section routes ───────────────────────────────────────────────
// GET    /teacher/sections/:id
router.get('/sections/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), section_controller_1.getSectionById);
// PUT    /teacher/sections/:id  (full update)
router.put('/sections/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: section_validation_1.updateSectionSchema }), section_controller_1.updateSection);
// PATCH  /teacher/sections/:id  (partial update)
router.patch('/sections/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema, body: section_validation_1.updateSectionSchema }), section_controller_1.updateSection);
// DELETE /teacher/sections/:id  (soft delete)
router.delete('/sections/:id', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), section_controller_1.deleteSection);
// PATCH  /teacher/sections/:id/archive
router.patch('/sections/:id/archive', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), section_controller_1.archiveSection);
// PATCH  /teacher/sections/:id/restore
router.patch('/sections/:id/restore', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), section_controller_1.restoreSection);
// POST   /teacher/sections/:id/duplicate
router.post('/sections/:id/duplicate', (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), section_controller_1.duplicateSection);
exports.default = router;
