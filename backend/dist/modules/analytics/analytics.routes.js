"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), analytics_controller_1.getPlatformAnalytics);
exports.default = router;
