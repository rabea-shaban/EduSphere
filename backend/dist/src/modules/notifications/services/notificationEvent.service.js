"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEventService = void 0;
const template_service_1 = require("./template.service");
const deliveryChannel_service_1 = require("./deliveryChannel.service");
class NotificationEventService {
    /**
     * Event: Student Enrolled in Course -> Notify Teacher
     */
    static async onStudentEnrolled(teacherId, studentName, courseTitle) {
        const formatted = template_service_1.TemplateService.formatMessage('ENROLLMENT', { studentName, courseTitle });
        await deliveryChannel_service_1.DeliveryChannelService.dispatch(teacherId, {
            title: formatted.title,
            message: formatted.message,
            type: 'Course',
            priority: 'Medium',
        });
    }
    /**
     * Event: Assignment Submitted -> Notify Teacher
     */
    static async onAssignmentSubmitted(teacherId, studentName, assignmentTitle, courseTitle) {
        const formatted = template_service_1.TemplateService.formatMessage('ASSIGNMENT_SUBMISSION', { studentName, assignmentTitle, courseTitle });
        await deliveryChannel_service_1.DeliveryChannelService.dispatch(teacherId, {
            title: formatted.title,
            message: formatted.message,
            type: 'Assignment',
            priority: 'High',
        });
    }
    /**
     * Event: Quiz Completed -> Notify Teacher
     */
    static async onQuizCompleted(teacherId, studentName, quizTitle, score) {
        const formatted = template_service_1.TemplateService.formatMessage('QUIZ_ATTEMPT', { studentName, quizTitle, score });
        await deliveryChannel_service_1.DeliveryChannelService.dispatch(teacherId, {
            title: formatted.title,
            message: formatted.message,
            type: 'Quiz',
            priority: 'Medium',
        });
    }
    /**
     * Event: Withdrawal Status Changed -> Notify Teacher
     */
    static async onWithdrawalStatusChanged(teacherId, status, amount, reason) {
        const eventType = status === 'APPROVED' ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED';
        const formatted = template_service_1.TemplateService.formatMessage(eventType, { amount, reason });
        await deliveryChannel_service_1.DeliveryChannelService.dispatch(teacherId, {
            title: formatted.title,
            message: formatted.message,
            type: 'Payment',
            priority: 'High',
        });
    }
}
exports.NotificationEventService = NotificationEventService;
exports.default = NotificationEventService;
