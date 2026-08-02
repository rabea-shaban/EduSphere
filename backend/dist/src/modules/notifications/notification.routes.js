"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const user_validation_1 = require("../users/user.validation");
const notification_validation_1 = require("./notification.validation");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
// Read routes (authenticated users)
router.get('/', authMiddleware_1.protect, notification_controller_1.getMyNotifications);
router.patch('/mark-all-read', authMiddleware_1.protect, notification_controller_1.markAllAsRead);
router.patch('/read-all', authMiddleware_1.protect, notification_controller_1.markAllAsRead);
router.patch('/:id/read', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), notification_controller_1.markAsRead);
router.delete('/:id', authMiddleware_1.protect, (0, validationMiddleware_1.validationMiddleware)({ params: user_validation_1.userIdSchema }), notification_controller_1.deleteNotification);
// Write routes (admins and teachers only)
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: notification_validation_1.createNotificationSchema }), notification_controller_1.createNotification);
exports.default = router;
