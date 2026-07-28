import { Types } from 'mongoose';
import { Notification } from '../notification.model';

export interface TeacherNotificationAnalytics {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  readRatioPercentage: number;
  typeBreakdown: {
    course: number;
    assignment: number;
    quiz: number;
    payment: number;
    system: number;
  };
}

export class NotificationAnalyticsService {
  /**
   * Generates notification metrics for a teacher.
   */
  static async getTeacherNotificationAnalytics(userId: string): Promise<TeacherNotificationAnalytics> {
    const recipientId = new Types.ObjectId(userId);

    const notifications = await Notification.find({ recipientId }).lean();

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
      if (n.isRead) readCount++;
      else unreadCount++;

      const t = String(n.type).toLowerCase();
      if (t.includes('course') || t.includes('lesson')) typeBreakdown.course++;
      else if (t.includes('assignment')) typeBreakdown.assignment++;
      else if (t.includes('quiz') || t.includes('exam')) typeBreakdown.quiz++;
      else if (t.includes('payment')) typeBreakdown.payment++;
      else typeBreakdown.system++;
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

export default NotificationAnalyticsService;
