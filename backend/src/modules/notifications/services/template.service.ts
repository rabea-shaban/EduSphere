export class TemplateService {
  /**
   * Formats dynamic notification message templates.
   */
  static formatMessage(type: string, params: Record<string, any>): { title: string; message: string } {
    switch (type) {
      case 'ENROLLMENT':
        return {
          title: 'اشتراك طالب جديد 🎓',
          message: `انضم الطالب (${params.studentName || 'طالب جديد'}) لكورس (${params.courseTitle || 'الكورس'}).`,
        };
      case 'ASSIGNMENT_SUBMISSION':
        return {
          title: 'تسليم واجب جديد 📝',
          message: `قام الطالب (${params.studentName}) بتسليم واجب (${params.assignmentTitle}) في كورس (${params.courseTitle}).`,
        };
      case 'QUIZ_ATTEMPT':
        return {
          title: 'إتمام إجابة اختبار 🎯',
          message: `أكمل الطالب (${params.studentName}) اختبار (${params.quizTitle}) بحصوله على درجة ${params.score}%.`,
        };
      case 'NEW_REVIEW':
        return {
          title: 'تقييم كورس جديد ⭐️',
          message: `قام الطالب (${params.studentName}) بتقديم تقييم ${params.rating} نجوم لكورس (${params.courseTitle}).`,
        };
      case 'TEACHER_REPLY':
        return {
          title: 'رد جديد من المحاضر 💬',
          message: `قام المحاضر بالرد على تقييمك لكورس (${params.courseTitle}).`,
        };
      case 'WITHDRAWAL_APPROVED':
        return {
          title: 'تم اعتماد طلب السحب 🎉',
          message: `وافقت الإدارة على طلب سحب المبلغ (${params.amount} ج.م) وتم إرسال كود/إيصال السداد.`,
        };
      case 'WITHDRAWAL_REJECTED':
        return {
          title: 'تم رفض طلب السحب ⚠️',
          message: `تعذر اعتماد طلب سحب المبلغ (${params.amount} ج.م) لسبب: ${params.reason || 'مراجعة بيانات المحفظة'}.`,
        };
      case 'PAYMENT_RECEIVED':
        return {
          title: 'تسجيل عملية شراء وتدفق مالي 💰',
          message: `تم تحصيل مبلغ (${params.amount} ج.م) لاشتراك الطالب (${params.studentName}) في كورس (${params.courseTitle}).`,
        };
      default:
        return {
          title: params.title || 'إشعار نظام EduSphere 🔔',
          message: params.message || 'لديك تحديث جديد في المنصة.',
        };
    }
  }
}

export default TemplateService;
