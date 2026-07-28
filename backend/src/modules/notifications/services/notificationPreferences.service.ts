import { Types } from 'mongoose';
import { NotificationPreference, INotificationPreferenceDocument } from '../notificationPreference.model';

export class NotificationPreferencesService {
  /**
   * Gets or creates default notification preferences for a user.
   */
  static async getPreferences(userId: string): Promise<INotificationPreferenceDocument> {
    const uid = new Types.ObjectId(userId);
    let pref = await NotificationPreference.findOne({ userId: uid });

    if (!pref) {
      pref = await NotificationPreference.create({
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
  static async updatePreferences(userId: string, data: Partial<INotificationPreferenceDocument>): Promise<INotificationPreferenceDocument> {
    const uid = new Types.ObjectId(userId);
    let pref = await NotificationPreference.findOne({ userId: uid });

    if (!pref) {
      pref = new NotificationPreference({ userId: uid, ...data });
    } else {
      if (data.channels) pref.channels = { ...pref.channels, ...data.channels };
      if (data.categories) pref.categories = { ...pref.categories, ...data.categories };
      if (data.frequency) pref.frequency = data.frequency;
    }

    await pref.save();
    return pref;
  }
}

export default NotificationPreferencesService;
