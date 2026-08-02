"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const socket_1 = require("../../config/socket");
const activityLog_model_1 = __importDefault(require("../activityLogs/activityLog.model"));
class RealtimeService {
    /**
     * Emit new student enrollment event to teacher
     */
    static emitStudentEnrolled(teacherId, data) {
        const payload = {
            type: 'student.enrolled',
            title: 'تسجيل طالب جديد 🎓',
            message: `قام الطالب ${data.studentName} بالتسجيل في كورس "${data.courseTitle}"`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'student.enrolled', payload);
        (0, socket_1.emitToTeacher)(teacherId, 'dashboard.updated', { trigger: 'enrollment' });
        this.logRealtimeEvent(teacherId, 'student.enrolled', payload.message);
    }
    /**
     * Emit new purchase / revenue update event
     */
    static emitPaymentCompleted(teacherId, data) {
        const payload = {
            type: 'payment.completed',
            title: 'عملية شراء جديدة 💰',
            message: `تم شراء كورس "${data.courseTitle}" بمبلغ ${data.amount} ج.م (صافي أرباحك: ${data.netEarnings} ج.م)`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'payment.completed', payload);
        (0, socket_1.emitToTeacher)(teacherId, 'revenue.updated', data);
        (0, socket_1.emitToTeacher)(teacherId, 'dashboard.updated', { trigger: 'revenue' });
        this.logRealtimeEvent(teacherId, 'payment.completed', payload.message);
    }
    /**
     * Emit assignment submission event
     */
    static emitAssignmentSubmitted(teacherId, data) {
        const payload = {
            type: 'assignment.submitted',
            title: 'تسليم واجب جديد 📝',
            message: `قام الطالب ${data.studentName} بتسليم واجب "${data.assignmentTitle}"`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'assignment.submitted', payload);
        this.logRealtimeEvent(teacherId, 'assignment.submitted', payload.message);
    }
    /**
     * Emit quiz submission event
     */
    static emitQuizSubmitted(teacherId, data) {
        const payload = {
            type: 'quiz.submitted',
            title: 'إكمال اختبار جديد ⏱️',
            message: `أكمل الطالب ${data.studentName} اختبار "${data.quizTitle}" بنتيجة ${data.score}/${data.totalMarks}`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'quiz.submitted', payload);
        this.logRealtimeEvent(teacherId, 'quiz.submitted', payload.message);
    }
    /**
     * Emit course review created event
     */
    static emitReviewCreated(teacherId, data) {
        const payload = {
            type: 'review.created',
            title: 'تقييم جديد للكورس ⭐',
            message: `قام الطالب ${data.studentName} بإضافة تقييم ${data.rating} نجوم على كورس "${data.courseTitle}"`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'review.created', payload);
        this.logRealtimeEvent(teacherId, 'review.created', payload.message);
    }
    /**
     * Emit withdrawal status update event
     */
    static emitWithdrawalUpdated(teacherId, data) {
        const payload = {
            type: 'withdrawal.updated',
            title: 'تحديث طلب السحب 🏦',
            message: `تم تحديث حالة طلب سحب الأرباح بقيمة ${data.amount} ج.م إلى (${data.status})`,
            data,
            timestamp: new Date().toISOString(),
        };
        (0, socket_1.emitToTeacher)(teacherId, 'withdrawal.updated', payload);
        this.logRealtimeEvent(teacherId, 'withdrawal.updated', payload.message);
    }
    /**
     * Emit file upload progress & completed events
     */
    static emitFileUploadProgress(teacherId, fileId, progressPercentage) {
        (0, socket_1.emitToTeacher)(teacherId, 'file.upload.progress', { fileId, progressPercentage });
    }
    static emitFileUploadCompleted(teacherId, fileData) {
        (0, socket_1.emitToTeacher)(teacherId, 'file.upload.completed', {
            type: 'file.upload.completed',
            title: 'تم رفع الملف بنجاح 📁',
            message: `تم رفع وتخزين الملف "${fileData.originalName}" بنجاح`,
            fileData,
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Helper to log socket activity to audit logs
     */
    static async logRealtimeEvent(userId, eventName, details) {
        await activityLog_model_1.default.create({
            userId: userId.toString(),
            action: `إرسال حدث لحظي: [${eventName}] - ${details}`,
            category: 'Settings',
            module: 'RealtimeEngine',
            status: 'SUCCESS',
        }).catch(() => { });
    }
}
exports.RealtimeService = RealtimeService;
exports.default = RealtimeService;
