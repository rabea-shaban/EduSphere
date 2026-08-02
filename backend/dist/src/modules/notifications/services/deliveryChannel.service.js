"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryChannelService = void 0;
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../notification.model");
const notificationPreferences_service_1 = require("./notificationPreferences.service");
const realtimeDelivery_service_1 = require("./realtimeDelivery.service");
class DeliveryChannelService {
    /**
     * Dispatches a notification across enabled channels (InApp, Email, Push).
     */
    static async dispatch(recipientId, payload) {
        const prefs = await notificationPreferences_service_1.NotificationPreferencesService.getPreferences(recipientId.toString());
        // Check if channel inApp is enabled
        if (!prefs.channels.inApp) {
            return null;
        }
        const notification = await notification_model_1.Notification.create({
            recipientId: new mongoose_1.Types.ObjectId(recipientId),
            senderId: payload.senderId ? new mongoose_1.Types.ObjectId(payload.senderId) : undefined,
            title: payload.title,
            message: payload.message,
            type: payload.type,
            priority: payload.priority || 'Medium',
            deliveryChannel: ['InApp'],
            isRead: false,
        });
        // Real-time push via Socket.io
        realtimeDelivery_service_1.RealtimeDeliveryService.pushNotification(recipientId, notification);
        // Calculate updated unread count and push
        const unreadCount = await notification_model_1.Notification.countDocuments({ recipientId: new mongoose_1.Types.ObjectId(recipientId), isRead: false });
        realtimeDelivery_service_1.RealtimeDeliveryService.pushUnreadCount(recipientId, unreadCount);
        return notification;
    }
}
exports.DeliveryChannelService = DeliveryChannelService;
exports.default = DeliveryChannelService;
