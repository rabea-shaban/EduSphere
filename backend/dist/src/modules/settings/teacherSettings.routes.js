"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const teacherSettings_validation_1 = require("./teacherSettings.validation");
const teacherSettings_controller_1 = require("./teacherSettings.controller");
const router = (0, express_1.Router)();
// Protect all routes below with authentication and TEACHER/ADMIN role
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.restrictTo)('TEACHER', 'ADMIN', 'SUPER_ADMIN'));
// Core Settings GET & Full PUT
router.get('/', teacherSettings_controller_1.getTeacherSettings);
router.put('/', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updateTeacherSettingsSchema }), teacherSettings_controller_1.updateTeacherSettings);
// Partial PATCH endpoints
router.patch('/general', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updateGeneralSettingsSchema }), teacherSettings_controller_1.updateGeneralSettings);
router.patch('/appearance', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updateAppearanceSettingsSchema }), teacherSettings_controller_1.updateAppearanceSettings);
router.patch('/notifications', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updateNotificationSettingsSchema }), teacherSettings_controller_1.updateNotificationSettings);
router.patch('/privacy', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updatePrivacySettingsSchema }), teacherSettings_controller_1.updatePrivacySettings);
router.patch('/security', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.updateSecuritySettingsSchema }), teacherSettings_controller_1.updateSecuritySettings);
// Session Management
router.get('/sessions', teacherSettings_controller_1.getActiveSessions);
router.delete('/sessions/:id', teacherSettings_controller_1.revokeSession);
router.delete('/sessions', teacherSettings_controller_1.logoutAllDevices);
// Account Lifecycle & GDPR Data Export
router.post('/export-data', teacherSettings_controller_1.exportPersonalData);
router.post('/deactivate-account', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.confirmPasswordSchema }), teacherSettings_controller_1.deactivateAccount);
router.post('/delete-account', (0, validationMiddleware_1.validationMiddleware)({ body: teacherSettings_validation_1.confirmPasswordSchema }), teacherSettings_controller_1.deleteAccount);
exports.default = router;
