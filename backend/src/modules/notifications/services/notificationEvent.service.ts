import { Types } from 'mongoose';
import { TemplateService } from './template.service';
import { DeliveryChannelService } from './deliveryChannel.service';

export class NotificationEventService {
  /**
   * Event: Student Enrolled in Course -> Notify Teacher
   */
  static async onStudentEnrolled(teacherId: Types.ObjectId | string, studentName: string, courseTitle: string): Promise<void> {
    const formatted = TemplateService.formatMessage('ENROLLMENT', { studentName, courseTitle });
    await DeliveryChannelService.dispatch(teacherId, {
      title: formatted.title,
      message: formatted.message,
      type: 'Course',
      priority: 'Medium',
    });
  }

  /**
   * Event: Assignment Submitted -> Notify Teacher
   */
  static async onAssignmentSubmitted(
    teacherId: Types.ObjectId | string,
    studentName: string,
    assignmentTitle: string,
    courseTitle: string
  ): Promise<void> {
    const formatted = TemplateService.formatMessage('ASSIGNMENT_SUBMISSION', { studentName, assignmentTitle, courseTitle });
    await DeliveryChannelService.dispatch(teacherId, {
      title: formatted.title,
      message: formatted.message,
      type: 'Assignment',
      priority: 'High',
    });
  }

  /**
   * Event: Quiz Completed -> Notify Teacher
   */
  static async onQuizCompleted(
    teacherId: Types.ObjectId | string,
    studentName: string,
    quizTitle: string,
    score: number
  ): Promise<void> {
    const formatted = TemplateService.formatMessage('QUIZ_ATTEMPT', { studentName, quizTitle, score });
    await DeliveryChannelService.dispatch(teacherId, {
      title: formatted.title,
      message: formatted.message,
      type: 'Quiz',
      priority: 'Medium',
    });
  }

  /**
   * Event: Withdrawal Status Changed -> Notify Teacher
   */
  static async onWithdrawalStatusChanged(
    teacherId: Types.ObjectId | string,
    status: 'APPROVED' | 'REJECTED',
    amount: number,
    reason?: string
  ): Promise<void> {
    const eventType = status === 'APPROVED' ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED';
    const formatted = TemplateService.formatMessage(eventType, { amount, reason });
    await DeliveryChannelService.dispatch(teacherId, {
      title: formatted.title,
      message: formatted.message,
      type: 'Payment',
      priority: 'High',
    });
  }
}

export default NotificationEventService;
