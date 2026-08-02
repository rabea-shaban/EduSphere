"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const platformSettings_controller_1 = require("./platformSettings.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/settings/platform', platformSettings_controller_1.getPlatformSettingsAdmin);
router.patch('/settings/platform/:section', platformSettings_controller_1.updatePlatformSettingsSectionAdmin);
router.post('/settings/platform/test-email', platformSettings_controller_1.testEmailConfigAdmin);
router.post('/settings/platform/backup', platformSettings_controller_1.triggerBackupAdmin);
exports.default = router;
