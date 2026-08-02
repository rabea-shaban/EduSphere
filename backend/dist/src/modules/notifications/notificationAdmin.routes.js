"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const notificationAdmin_controller_1 = require("./notificationAdmin.controller");
const router = (0, express_1.Router)();
// Protect all routes to Super Admin & Admin
router.use(authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'));
router.get('/notifications', notificationAdmin_controller_1.getAllNotificationsAdmin);
router.post('/notifications/send', notificationAdmin_controller_1.sendBroadcastNotificationAdmin);
router.get('/notifications/:id', notificationAdmin_controller_1.getNotificationByIdAdmin);
router.delete('/notifications/:id', notificationAdmin_controller_1.deleteNotificationAdmin);
exports.default = router;
