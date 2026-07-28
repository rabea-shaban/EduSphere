import { Types } from 'mongoose';
import { Notification } from '../notification.model';
import { INotificationDocument } from '../notification.interface';
import { NotificationPreferencesService } from './notificationPreferences.service';
import { RealtimeDeliveryService } from './realtimeDelivery.service';

export class DeliveryChannelService {
  /**
   * Dispatches a notification across enabled channels (InApp, Email, Push).
   */
  static async dispatch(
    recipientId: Types.ObjectId | string,
    payload: {
      title: string;
      message: string;
      type: 'Course' | 'Lesson' | 'Assignment' | 'Quiz' | 'Exam' | 'Payment' | 'Announcement' | 'System' | 'Chat';
      priority?: 'Low' | 'Medium' | 'High';
      senderId?: Types.ObjectId | string;
    }
  ): Promise<INotificationDocument | null> {
    const prefs = await NotificationPreferencesService.getPreferences(recipientId.toString());

    // Check if channel inApp is enabled
    if (!prefs.channels.inApp) {
      return null;
    }

    const notification = await Notification.create({
      recipientId: new Types.ObjectId(recipientId) as any,
      senderId: payload.senderId ? (new Types.ObjectId(payload.senderId) as any) : undefined,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      priority: payload.priority || 'Medium',
      deliveryChannel: ['InApp'],
      isRead: false,
    });

    // Real-time push via Socket.io
    RealtimeDeliveryService.pushNotification(recipientId, notification);

    // Calculate updated unread count and push
    const unreadCount = await Notification.countDocuments({ recipientId: new Types.ObjectId(recipientId), isRead: false });
    RealtimeDeliveryService.pushUnreadCount(recipientId, unreadCount);

    return notification;
  }
}

export default DeliveryChannelService;
