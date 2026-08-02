"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAnalyticsService = void 0;
const mongoose_1 = require("mongoose");
const notification_model_1 = require("../notification.model");
class NotificationAnalyticsService {
    /**
     * Generates notification metrics for a teacher.
     */
    static async getTeacherNotificationAnalytics(userId) {
        const recipientId = new mongoose_1.Types.ObjectId(userId);
        const notifications = await notification_model_1.Notification.find({ recipientId }).lean();
        const totalNotifications = notifications.length;
        let unreadCount = 0;
        let readCount = 0;
        const typeBreakdown = {
            course: 0,
            assignment: 0,
            quiz: 0,
            payment: 0,
            system: 0,
        };
        notifications.forEach((n) => {
            if (n.isRead)
                readCount++;
            else
                unreadCount++;
            const t = String(n.type).toLowerCase();
            if (t.includes('course') || t.includes('lesson'))
                typeBreakdown.course++;
            else if (t.includes('assignment'))
                typeBreakdown.assignment++;
            else if (t.includes('quiz') || t.includes('exam'))
                typeBreakdown.quiz++;
            else if (t.includes('payment'))
                typeBreakdown.payment++;
            else
                typeBreakdown.system++;
        });
        const readRatioPercentage = totalNotifications > 0 ? Math.round((readCount / totalNotifications) * 100) : 0;
        return {
            totalNotifications,
            unreadCount,
            readCount,
            readRatioPercentage,
            typeBreakdown,
        };
    }
}
exports.NotificationAnalyticsService = NotificationAnalyticsService;
exports.default = NotificationAnalyticsService;
