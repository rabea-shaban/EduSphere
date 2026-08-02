"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherNotificationAnalytics = exports.updateTeacherNotificationPreferences = exports.getTeacherNotificationPreferences = exports.bulkDeleteTeacherNotifications = exports.deleteTeacherNotification = exports.markAllTeacherNotificationsAsRead = exports.markTeacherNotificationAsUnread = exports.markTeacherNotificationAsRead = exports.getTeacherNotificationById = exports.getTeacherNotifications = void 0;
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const activityLog_model_1 = require("../activityLogs/activityLog.model");
const mongoose_1 = require("mongoose");
const notificationManagement_service_1 = __importDefault(require("./services/notificationManagement.service"));
const notificationPreferences_service_1 = __importDefault(require("./services/notificationPreferences.service"));
const notificationAnalytics_service_1 = __importDefault(require("./services/notificationAnalytics.service"));
function logActivity(userId, userName, userRole, action, details) {
    activityLog_model_1.ActivityLog.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        userName,
        userRole,
        action,
        category: 'Admin',
        module: 'Notifications',
        status: 'SUCCESS',
        details,
    }).catch(() => { });
}
/**
 * GET /teacher/notifications
 */
exports.getTeacherNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const { page = 1, limit = 20, isRead, type, search } = req.query;
    const isReadBool = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    const result = await notificationManagement_service_1.default.getNotifications(userId, Number(page), Number(limit), isReadBool, type, search);
    await logActivity(userId, userName, userRole, 'NOTIFICATION_VIEWED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Teacher notifications retrieved successfully'));
});
/**
 * GET /teacher/notifications/:id
 */
exports.getTeacherNotificationById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const notification = await notificationManagement_service_1.default.getNotificationById(String(id), userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification details retrieved successfully'));
});
/**
 * PATCH /teacher/notifications/:id/read
 */
exports.markTeacherNotificationAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const notification = await notificationManagement_service_1.default.toggleRead(String(id), userId, true);
    await logActivity(userId, userName, userRole, 'NOTIFICATION_READ', { notificationId: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification marked as read'));
});
/**
 * PATCH /teacher/notifications/:id/unread
 */
exports.markTeacherNotificationAsUnread = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const notification = await notificationManagement_service_1.default.toggleRead(String(id), userId, false);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification marked as unread'));
});
/**
 * PATCH /teacher/notifications/read-all
 */
exports.markAllTeacherNotificationsAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    await notificationManagement_service_1.default.markAllAsRead(userId);
    await logActivity(userId, userName, userRole, 'NOTIFICATION_ALL_READ');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'All notifications marked as read'));
});
/**
 * DELETE /teacher/notifications/:id
 */
exports.deleteTeacherNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    await notificationManagement_service_1.default.deleteNotification(String(id), userId);
    await logActivity(userId, userName, userRole, 'NOTIFICATION_DELETED', { notificationId: id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Notification deleted successfully'));
});
/**
 * DELETE /teacher/notifications
 */
exports.bulkDeleteTeacherNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const { notificationIds, clearReadOnly } = req.body;
    await notificationManagement_service_1.default.bulkDelete(userId, notificationIds, clearReadOnly);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Notifications cleared successfully'));
});
/**
 * GET /teacher/notifications/preferences
 */
exports.getTeacherNotificationPreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const preferences = await notificationPreferences_service_1.default.getPreferences(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, preferences, 'Notification preferences retrieved successfully'));
});
/**
 * PUT /teacher/notifications/preferences
 */
exports.updateTeacherNotificationPreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    const preferences = await notificationPreferences_service_1.default.updatePreferences(userId, req.body);
    await logActivity(userId, userName, userRole, 'PREFERENCES_UPDATED');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, preferences, 'تم تحديث تفضيلات الإشعارات بنجاح'));
});
/**
 * GET /teacher/notifications/analytics
 */
exports.getTeacherNotificationAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id.toString();
    const analytics = await notificationAnalytics_service_1.default.getTeacherNotificationAnalytics(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, analytics, 'Notification analytics retrieved successfully'));
});
