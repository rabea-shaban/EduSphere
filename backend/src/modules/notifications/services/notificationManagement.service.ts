import { Types } from 'mongoose';
import { Notification } from '../notification.model';
import { INotificationDocument } from '../notification.interface';
import { ApiError } from '../../../utils/ApiError';
import { RealtimeDeliveryService } from './realtimeDelivery.service';

export class NotificationManagementService {
  /**
   * Retrieves notifications list with search, category filters, and pagination.
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

    const skip = (page - 1) * limit;

    let query = Notification.find(filter)
      .populate('senderId', 'firstName lastName avatar email')
      .sort({ createdAt: -1 });

    const notifications = await query.lean();

    let filtered = notifications;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });

    return {
      notifications: paginated,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

    // Push updated unread count via socket
    const unreadCount = await Notification.countDocuments({ recipientId: new Types.ObjectId(userId), isRead: false });
    RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);

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

    const unreadCount = await Notification.countDocuments({ recipientId: new Types.ObjectId(userId), isRead: false });
    RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
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

    const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });
    RealtimeDeliveryService.pushUnreadCount(userId, unreadCount);
  }
}

export default NotificationManagementService;
