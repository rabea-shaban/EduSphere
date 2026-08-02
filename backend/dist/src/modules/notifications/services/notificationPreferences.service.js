"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferencesService = void 0;
const mongoose_1 = require("mongoose");
const notificationPreference_model_1 = require("../notificationPreference.model");
class NotificationPreferencesService {
    /**
     * Gets or creates default notification preferences for a user.
     */
    static async getPreferences(userId) {
        const uid = new mongoose_1.Types.ObjectId(userId);
        let pref = await notificationPreference_model_1.NotificationPreference.findOne({ userId: uid });
        if (!pref) {
            pref = await notificationPreference_model_1.NotificationPreference.create({
                userId: uid,
                channels: { inApp: true, email: true, push: true, sms: false },
                categories: {
                    courseEnrollments: true,
                    assignments: true,
                    quizzes: true,
                    reviews: true,
                    paymentsAndWithdrawals: true,
                    systemAnnouncements: true,
                    securityAlerts: true,
                },
                frequency: 'INSTANT',
            });
        }
        return pref;
    }
    /**
     * Updates notification preferences for a user.
     */
    static async updatePreferences(userId, data) {
        const uid = new mongoose_1.Types.ObjectId(userId);
        let pref = await notificationPreference_model_1.NotificationPreference.findOne({ userId: uid });
        if (!pref) {
            pref = new notificationPreference_model_1.NotificationPreference({ userId: uid, ...data });
        }
        else {
            if (data.channels)
                pref.channels = { ...pref.channels, ...data.channels };
            if (data.categories)
                pref.categories = { ...pref.categories, ...data.categories };
            if (data.frequency)
                pref.frequency = data.frequency;
        }
        await pref.save();
        return pref;
    }
}
exports.NotificationPreferencesService = NotificationPreferencesService;
exports.default = NotificationPreferencesService;
