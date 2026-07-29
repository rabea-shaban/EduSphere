import { Types } from 'mongoose';
import { Notification } from '../notification.model';
import { INotificationDocument } from '../notification.interface';
import { ApiError } from '../../../utils/ApiError';
import { RealtimeDeliveryService } from './realtimeDelivery.service';

export class NotificationManagementService {
  /**
   * Retrieves notifications list with search, category filters, and pagination using DB-level skip/limit.
   */
  static async getNotifications(userId: string, page = 1, limit = 20, isRead?: boolean, type?: string, search?: string) {
    const recipientId = new Types.ObjectId(userId);

    const filter: any = { recipientId };
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
      Notification.find(filter)
        .populate('senderId', 'firstName lastName avatar email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipientId, isRead: false }),
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
  static async getUnreadCount(userId: string): Promise<number> {
    const recipientId = new Types.ObjectId(userId);
    return await Notification.countDocuments({ recipientId, isRead: false });
  }

  /**
   * Gets single notification details.
   */
  static async getNotificationById(notificationId: string, userId: string): Promise<INotificationDocument> {
    const notification = await Notification.findById(notificationId).populate('senderId', 'firstName lastName avatar');
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.recipientId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized access to notification');
    }

    return notification;
  }

  /**
   * Marks a notification as read or unread.
   */
  static async toggleRead(notificationId: string, userId: string, isRead: boolean): Promise<INotificationDocument> {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.recipientId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized access to notification');
    }

    notification.isRead = isRead;
    notification.readAt = isRead ? new Date() : undefined;
    await notification.save();

    // Push updated unread count via socket asynchronously
    Notification.countDocuments({ recipientId: new Types.ObjectId(userId), isRead: false }).then((unreadCount) => {
      RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
    });

    return notification;
  }

  /**
   * Marks all notifications as read for a user.
   */
  static async markAllAsRead(userId: string): Promise<void> {
    const recipientId = new Types.ObjectId(userId);
    await Notification.updateMany({ recipientId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });

    RealtimeDeliveryService.pushUnreadCount(userId, 0);
  }

  /**
   * Deletes a single notification.
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (notification.recipientId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized access to notification');
    }

    await notification.deleteOne();

    Notification.countDocuments({ recipientId: new Types.ObjectId(userId), isRead: false }).then((unreadCount) => {
      RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
    });
  }

  /**
   * Bulk deletes notifications or clears read notifications.
   */
  static async bulkDelete(userId: string, notificationIds?: string[], clearReadOnly?: boolean): Promise<void> {
    const recipientId = new Types.ObjectId(userId);

    if (clearReadOnly) {
      await Notification.deleteMany({ recipientId, isRead: true });
    } else if (notificationIds && notificationIds.length > 0) {
      const oids = notificationIds.map((id) => new Types.ObjectId(id));
      await Notification.deleteMany({ _id: { $in: oids }, recipientId });
    }

    Notification.countDocuments({ recipientId, isRead: false }).then((unreadCount) => {
      RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
    });
  }
}

export default NotificationManagementService;
