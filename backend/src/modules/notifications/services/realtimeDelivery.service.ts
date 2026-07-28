import { Types } from 'mongoose';
import { emitToUser } from '../../../config/socket';

export class RealtimeDeliveryService {
  /**
   * Pushes real-time notification payload to recipient via Socket.io.
   */
  static pushNotification(recipientId: Types.ObjectId | string, notification: any): void {
    try {
      emitToUser(recipientId, 'notification', notification);
    } catch {}
  }

  /**
   * Pushes updated unread badge count to recipient via Socket.io.
   */
  static pushUnreadCount(recipientId: Types.ObjectId | string, unreadCount: number): void {
    try {
      emitToUser(recipientId, 'unread_count', { unreadCount });
    } catch {}
  }
}

export default RealtimeDeliveryService;
