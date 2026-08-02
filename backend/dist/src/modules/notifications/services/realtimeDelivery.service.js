"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeDeliveryService = void 0;
const socket_1 = require("../../../config/socket");
class RealtimeDeliveryService {
    /**
     * Pushes real-time notification payload to recipient via Socket.io.
     */
    static pushNotification(recipientId, notification) {
        try {
            (0, socket_1.emitToUser)(recipientId, 'notification', notification);
        }
        catch { }
    }
    /**
     * Pushes updated unread badge count to recipient via Socket.io.
     */
    static pushUnreadCount(recipientId, unreadCount) {
        try {
            (0, socket_1.emitToUser)(recipientId, 'unread_count', { unreadCount });
        }
        catch { }
    }
}
exports.RealtimeDeliveryService = RealtimeDeliveryService;
exports.default = RealtimeDeliveryService;
