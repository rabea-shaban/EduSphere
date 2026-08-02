"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManagementService = void 0;
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../notification.model");
const ApiError_1 = require("../../../utils/ApiError");
const realtimeDelivery_service_1 = require("./realtimeDelivery.service");
class NotificationManagementService {
    /**
     * Retrieves notifications list with search, category filters, and pagination using DB-level skip/limit.
     */
    static async getNotifications(userId, page = 1, limit = 20, isRead, type, search) {
        const recipientId = new mongoose_1.Types.ObjectId(userId);
        const filter = { recipientId };
        if (isRead !== undefined) {
            filter.isRead = isRead;
        }
        if (type && type !== 'ALL') {
            filter.type = type;
        }
        if (search && search.trim()) {
            const s = search.trim();
            filter.$or = [
                { title: { $regex: s, $options: 'i' } },
                { message: { $regex: s, $options: 'i' } },
            ];
        }
        const skip = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
        const limitNum = Math.min(100, Math.max(1, limit));
        // Parallel DB queries for maximum performance (< 50ms)
        const [notifications, total, unreadCount] = await Promise.all([
            notification_model_1.Notification.find(filter)
                .populate('senderId', 'firstName lastName avatar email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            notification_model_1.Notification.countDocuments(filter),
            notification_model_1.Notification.countDocuments({ recipientId, isRead: false }),
        ]);
        return {
            notifications,
            unreadCount,
            pagination: {
                total,
                page,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1,
            },
        };
    }
    /**
     * Gets unread notifications count.
     */
    static async getUnreadCount(userId) {
        const recipientId = new mongoose_1.Types.ObjectId(userId);
        return await notification_model_1.Notification.countDocuments({ recipientId, isRead: false });
    }
    /**
     * Gets single notification details.
     */
    static async getNotificationById(notificationId, userId) {
        const notification = await notification_model_1.Notification.findById(notificationId).populate('senderId', 'firstName lastName avatar');
        if (!notification) {
            throw new ApiError_1.ApiError(404, 'Notification not found');
        }
        if (notification.recipientId.toString() !== userId) {
            throw new ApiError_1.ApiError(403, 'Unauthorized access to notification');
        }
        return notification;
    }
    /**
     * Marks a notification as read or unread.
     */
    static async toggleRead(notificationId, userId, isRead) {
        const notification = await notification_model_1.Notification.findById(notificationId);
        if (!notification) {
            throw new ApiError_1.ApiError(404, 'Notification not found');
        }
        if (notification.recipientId.toString() !== userId) {
            throw new ApiError_1.ApiError(403, 'Unauthorized access to notification');
        }
        notification.isRead = isRead;
        notification.readAt = isRead ? new Date() : undefined;
        await notification.save();
        // Push updated unread count via socket asynchronously
        notification_model_1.Notification.countDocuments({ recipientId: new mongoose_1.Types.ObjectId(userId), isRead: false }).then((unreadCount) => {
            realtimeDelivery_service_1.RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
        });
        return notification;
    }
    /**
     * Marks all notifications as read for a user.
     */
    static async markAllAsRead(userId) {
        const recipientId = new mongoose_1.Types.ObjectId(userId);
        await notification_model_1.Notification.updateMany({ recipientId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
        realtimeDelivery_service_1.RealtimeDeliveryService.pushUnreadCount(userId, 0);
    }
    /**
     * Deletes a single notification.
     */
    static async deleteNotification(notificationId, userId) {
        const notification = await notification_model_1.Notification.findById(notificationId);
        if (!notification) {
            throw new ApiError_1.ApiError(404, 'Notification not found');
        }
        if (notification.recipientId.toString() !== userId) {
            throw new ApiError_1.ApiError(403, 'Unauthorized access to notification');
        }
        await notification.deleteOne();
        notification_model_1.Notification.countDocuments({ recipientId: new mongoose_1.Types.ObjectId(userId), isRead: false }).then((unreadCount) => {
            realtimeDelivery_service_1.RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
        });
    }
    /**
     * Bulk deletes notifications or clears read notifications.
     */
    static async bulkDelete(userId, notificationIds, clearReadOnly) {
        const recipientId = new mongoose_1.Types.ObjectId(userId);
        if (clearReadOnly) {
            await notification_model_1.Notification.deleteMany({ recipientId, isRead: true });
        }
        else if (notificationIds && notificationIds.length > 0) {
            const oids = notificationIds.map((id) => new mongoose_1.Types.ObjectId(id));
            await notification_model_1.Notification.deleteMany({ _id: { $in: oids }, recipientId });
        }
        notification_model_1.Notification.countDocuments({ recipientId, isRead: false }).then((unreadCount) => {
            realtimeDelivery_service_1.RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
        });
    }
}
exports.NotificationManagementService = NotificationManagementService;
exports.default = NotificationManagementService;
