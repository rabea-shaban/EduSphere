"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyNotifications = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.createNotification = void 0;
const notification_model_1 = require("./notification.model");
const socket_1 = require("../../config/socket");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new notification and push it in real-time.
 */
exports.createNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const notification = await notification_model_1.Notification.create(req.body);
    // Emit to Socket.io recipient room
    (0, socket_1.emitToUser)(notification.recipientId, 'notification', notification);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, notification, 'Notification dispatched successfully'));
});
/**
 * Mark a specific notification as read.
 */
exports.markAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const studentId = req.user?._id;
    const notification = await notification_model_1.Notification.findById(id);
    if (!notification) {
        throw new ApiError_1.ApiError(404, 'Notification not found');
    }
    // Ensure owner is modifying
    if (studentId && notification.recipientId.toString() !== studentId.toString()) {
        throw new ApiError_1.ApiError(403, 'Unauthorized');
    }
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification marked as read'));
});
/**
 * Mark all notifications for the current user as read.
 */
exports.markAllAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const recipientId = req.user?._id;
    if (!recipientId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const now = new Date();
    await notification_model_1.Notification.updateMany({ recipientId, isRead: false }, { $set: { isRead: true, readAt: now } });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'All notifications marked as read'));
});
/**
 * Delete a specific notification.
 */
exports.deleteNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const studentId = req.user?._id;
    const notification = await notification_model_1.Notification.findById(id);
    if (!notification) {
        throw new ApiError_1.ApiError(404, 'Notification not found');
    }
    // Ensure owner is deleting
    if (studentId && notification.recipientId.toString() !== studentId.toString()) {
        throw new ApiError_1.ApiError(403, 'Unauthorized');
    }
    await notification.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Notification deleted successfully'));
});
/**
 * Retrieve notifications of the logged in user.
 */
exports.getMyNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const recipientId = req.user?._id;
    const { page = 1, limit = 20, isRead } = req.query;
    if (!recipientId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const filter = { recipientId };
    if (isRead !== undefined) {
        filter.isRead = isRead === 'true';
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const notifications = await notification_model_1.Notification.find(filter)
        .populate('senderId', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await notification_model_1.Notification.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        notifications,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Notifications history retrieved successfully'));
});
exports.default = exports.createNotification;
