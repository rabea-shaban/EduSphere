"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const activityLog_controller_1 = require("./activityLog.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/', activityLog_controller_1.getAllLogs);
router.get('/statistics', activityLog_controller_1.getAuditLogStatistics);
router.get('/:id', activityLog_controller_1.getLogById);
exports.default = router;
