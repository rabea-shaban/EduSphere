import { emitToTeacher } from '../../config/socket';
import ActivityLog from '../activityLogs/activityLog.model';

export class RealtimeService {
  /**
   * Emit new student enrollment event to teacher
   */
  static emitStudentEnrolled(teacherId: any, data: { studentName: string; courseTitle: string; courseId: string; amount?: number }) {
    const payload = {
      type: 'student.enrolled',
      title: 'تسجيل طالب جديد 🎓',
      message: `قام الطالب ${data.studentName} بالتسجيل في كورس "${data.courseTitle}"`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'student.enrolled', payload);
    emitToTeacher(teacherId, 'dashboard.updated', { trigger: 'enrollment' });
    this.logRealtimeEvent(teacherId, 'student.enrolled', payload.message);
  }

  /**
   * Emit new purchase / revenue update event
   */
  static emitPaymentCompleted(teacherId: any, data: { amount: number; courseTitle: string; studentName: string; netEarnings: number }) {
    const payload = {
      type: 'payment.completed',
      title: 'عملية شراء جديدة 💰',
      message: `تم شراء كورس "${data.courseTitle}" بمبلغ ${data.amount} ج.م (صافي أرباحك: ${data.netEarnings} ج.م)`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'payment.completed', payload);
    emitToTeacher(teacherId, 'revenue.updated', data);
    emitToTeacher(teacherId, 'dashboard.updated', { trigger: 'revenue' });
    this.logRealtimeEvent(teacherId, 'payment.completed', payload.message);
  }

  /**
   * Emit assignment submission event
   */
  static emitAssignmentSubmitted(teacherId: any, data: { assignmentTitle: string; studentName: string; assignmentId: string; submissionId: string }) {
    const payload = {
      type: 'assignment.submitted',
      title: 'تسليم واجب جديد 📝',
      message: `قام الطالب ${data.studentName} بتسليم واجب "${data.assignmentTitle}"`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'assignment.submitted', payload);
    this.logRealtimeEvent(teacherId, 'assignment.submitted', payload.message);
  }

  /**
   * Emit quiz submission event
   */
  static emitQuizSubmitted(teacherId: any, data: { quizTitle: string; studentName: string; score: number; totalMarks: number }) {
    const payload = {
      type: 'quiz.submitted',
      title: 'إكمال اختبار جديد ⏱️',
      message: `أكمل الطالب ${data.studentName} اختبار "${data.quizTitle}" بنتيجة ${data.score}/${data.totalMarks}`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'quiz.submitted', payload);
    this.logRealtimeEvent(teacherId, 'quiz.submitted', payload.message);
  }

  /**
   * Emit course review created event
   */
  static emitReviewCreated(teacherId: any, data: { courseTitle: string; studentName: string; rating: number; comment?: string }) {
    const payload = {
      type: 'review.created',
      title: 'تقييم جديد للكورس ⭐',
      message: `قام الطالب ${data.studentName} بإضافة تقييم ${data.rating} نجوم على كورس "${data.courseTitle}"`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'review.created', payload);
    this.logRealtimeEvent(teacherId, 'review.created', payload.message);
  }

  /**
   * Emit withdrawal status update event
   */
  static emitWithdrawalUpdated(teacherId: any, data: { withdrawalId: string; amount: number; status: string }) {
    const payload = {
      type: 'withdrawal.updated',
      title: 'تحديث طلب السحب 🏦',
      message: `تم تحديث حالة طلب سحب الأرباح بقيمة ${data.amount} ج.م إلى (${data.status})`,
      data,
      timestamp: new Date().toISOString(),
    };
    emitToTeacher(teacherId, 'withdrawal.updated', payload);
    this.logRealtimeEvent(teacherId, 'withdrawal.updated', payload.message);
  }

  /**
   * Emit file upload progress & completed events
   */
  static emitFileUploadProgress(teacherId: any, fileId: string, progressPercentage: number) {
    emitToTeacher(teacherId, 'file.upload.progress', { fileId, progressPercentage });
  }

  static emitFileUploadCompleted(teacherId: any, fileData: any) {
    emitToTeacher(teacherId, 'file.upload.completed', {
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
  private static async logRealtimeEvent(userId: any, eventName: string, details: string) {
    await ActivityLog.create({
      userId: userId.toString(),
      action: `إرسال حدث لحظي: [${eventName}] - ${details}`,
      category: 'Settings',
      module: 'RealtimeEngine',
      status: 'SUCCESS',
    } as any).catch(() => {});
  }
}
export default RealtimeService;
