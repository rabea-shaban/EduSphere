"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const academicYear_routes_1 = __importDefault(require("../modules/academicYears/academicYear.routes"));
const grade_routes_1 = __importDefault(require("../modules/grades/grade.routes"));
const term_routes_1 = __importDefault(require("../modules/terms/term.routes"));
const subject_routes_1 = __importDefault(require("../modules/subjects/subject.routes"));
const course_routes_1 = __importDefault(require("../modules/courses/course.routes"));
const unit_routes_1 = __importDefault(require("../modules/units/unit.routes"));
const lesson_routes_1 = __importDefault(require("../modules/lessons/lesson.routes"));
const enrollment_routes_1 = __importDefault(require("../modules/enrollments/enrollment.routes"));
const progress_routes_1 = __importDefault(require("../modules/progress/progress.routes"));
const video_routes_1 = __importDefault(require("../modules/videos/video.routes"));
const resource_routes_1 = __importDefault(require("../modules/resources/resource.routes"));
const questionBank_routes_1 = __importDefault(require("../modules/questionBank/questionBank.routes"));
const quiz_routes_1 = __importDefault(require("../modules/quizzes/quiz.routes"));
const question_routes_1 = __importDefault(require("../modules/questions/question.routes"));
const examAttempt_routes_1 = __importDefault(require("../modules/examAttempts/examAttempt.routes"));
const answer_routes_1 = __importDefault(require("../modules/answers/answer.routes"));
const assignment_routes_1 = __importDefault(require("../modules/assignments/assignment.routes"));
const submission_routes_1 = __importDefault(require("../modules/submissions/submission.routes"));
const student_routes_1 = __importDefault(require("../modules/students/student.routes"));
const notification_routes_1 = __importDefault(require("../modules/notifications/notification.routes"));
const teacherNotification_routes_1 = __importDefault(require("../modules/notifications/teacherNotification.routes"));
const teacherProfile_routes_1 = __importDefault(require("../modules/teachers/teacherProfile.routes"));
const announcement_routes_1 = __importDefault(require("../modules/announcements/announcement.routes"));
const liveSession_routes_1 = __importDefault(require("../modules/liveSessions/liveSession.routes"));
const message_routes_1 = __importDefault(require("../modules/messages/message.routes"));
const conversation_routes_1 = __importDefault(require("../modules/conversations/conversation.routes"));
const subscription_routes_1 = __importDefault(require("../modules/subscriptions/subscription.routes"));
const payment_routes_1 = __importDefault(require("../modules/payments/payment.routes"));
const earnings_routes_1 = __importDefault(require("../modules/payments/earnings.routes"));
const withdrawal_routes_1 = __importDefault(require("../modules/payments/withdrawal.routes"));
const review_routes_1 = __importDefault(require("../modules/reviews/review.routes"));
const transaction_routes_1 = __importDefault(require("../modules/transactions/transaction.routes"));
const coupon_routes_1 = __importDefault(require("../modules/coupons/coupon.routes"));
const invoice_routes_1 = __importDefault(require("../modules/invoices/invoice.routes"));
const category_routes_1 = __importDefault(require("../modules/categories/category.routes"));
const page_routes_1 = __importDefault(require("../modules/pages/page.routes"));
const banner_routes_1 = __importDefault(require("../modules/banners/banner.routes"));
const blog_routes_1 = __importDefault(require("../modules/blogs/blog.routes"));
const faq_routes_1 = __importDefault(require("../modules/faqs/faq.routes"));
const testimonial_routes_1 = __importDefault(require("../modules/testimonials/testimonial.routes"));
const contact_routes_1 = __importDefault(require("../modules/contacts/contact.routes"));
const menu_routes_1 = __importDefault(require("../modules/menus/menu.routes"));
const settings_routes_1 = __importDefault(require("../modules/settings/settings.routes"));
const seo_routes_1 = __importDefault(require("../modules/seo/seo.routes"));
const socialLinks_routes_1 = __importDefault(require("../modules/socialLinks/socialLinks.routes"));
const dashboard_routes_1 = __importDefault(require("../modules/dashboard/dashboard.routes"));
const analytics_routes_1 = __importDefault(require("../modules/analytics/analytics.routes"));
const reports_routes_1 = __importDefault(require("../modules/reports/reports.routes"));
const activityLog_routes_1 = __importDefault(require("../modules/activityLogs/activityLog.routes"));
const ai_routes_1 = __importDefault(require("../modules/ai/ai.routes"));
const teacherApplication_routes_1 = __importDefault(require("../modules/teacherApplications/teacherApplication.routes"));
const teacher_routes_1 = __importDefault(require("../modules/teachers/teacher.routes"));
const student_routes_2 = __importDefault(require("../modules/students/student.routes"));
const courseAdmin_routes_1 = __importDefault(require("../modules/courses/courseAdmin.routes"));
const paymentAdmin_routes_1 = __importDefault(require("../modules/payments/paymentAdmin.routes"));
const categoryAdmin_routes_1 = __importDefault(require("../modules/categories/categoryAdmin.routes"));
const couponAdmin_routes_1 = __importDefault(require("../modules/coupons/couponAdmin.routes"));
const notificationAdmin_routes_1 = __importDefault(require("../modules/notifications/notificationAdmin.routes"));
const reportAdmin_routes_1 = __importDefault(require("../modules/reports/reportAdmin.routes"));
const cmsAdmin_routes_1 = __importDefault(require("../modules/cms/cmsAdmin.routes"));
const platformSettings_routes_1 = __importDefault(require("../modules/settings/platformSettings.routes"));
const roleAdmin_routes_1 = __importDefault(require("../modules/roles/roleAdmin.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const section_routes_1 = __importDefault(require("../modules/sections/section.routes"));
const teacherSettings_routes_1 = __importDefault(require("../modules/settings/teacherSettings.routes"));
const fileAsset_routes_1 = __importDefault(require("../modules/upload/fileAsset.routes"));
const search_routes_1 = __importDefault(require("../modules/search/search.routes"));
const router = (0, express_1.Router)();
/**
 * @route   GET /
 * @desc    Health Check / Sample Route
 * @access  Public
 */
router.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'EduSphere Backend Running Successfully',
    });
});
// Authentication Routes
router.use('/auth', auth_routes_1.default);
// User Module Routes
router.use('/users', user_routes_1.default);
// Admin Management Routes
router.use('/admin/teachers', teacher_routes_1.default);
router.use('/teachers', teacher_routes_1.default);
router.use('/admin/students', student_routes_2.default);
router.use('/students', student_routes_2.default);
router.use('/admin/courses', courseAdmin_routes_1.default);
router.use('/admin', paymentAdmin_routes_1.default);
router.use('/admin', categoryAdmin_routes_1.default);
router.use('/admin', couponAdmin_routes_1.default);
router.use('/admin/coupons', couponAdmin_routes_1.default);
router.use('/admin', notificationAdmin_routes_1.default);
router.use('/admin', reportAdmin_routes_1.default);
router.use('/admin', cmsAdmin_routes_1.default);
router.use('/admin', platformSettings_routes_1.default);
router.use('/admin', roleAdmin_routes_1.default);
router.use('/admin/audit-logs', activityLog_routes_1.default);
router.use('/activity-logs', activityLog_routes_1.default);
router.use('/admin/blog', blog_routes_1.default);
router.use('/admin/subscriptions', subscription_routes_1.default);
// Academic Structure Routes
router.use('/academic-years', academicYear_routes_1.default);
router.use('/grades', grade_routes_1.default);
router.use('/terms', term_routes_1.default);
router.use('/subjects', subject_routes_1.default);
// Course Management Routes
router.use('/courses', course_routes_1.default);
router.use('/units', unit_routes_1.default);
router.use('/lessons', lesson_routes_1.default);
// Enrollment & Progress Routes
router.use('/enrollments', enrollment_routes_1.default);
router.use('/progress', progress_routes_1.default);
// Content Management Routes
router.use('/upload', upload_routes_1.default);
router.use('/videos', video_routes_1.default);
router.use('/resources', resource_routes_1.default);
// Assessment System Routes
router.use('/question-bank', questionBank_routes_1.default);
router.use('/quizzes', quiz_routes_1.default);
router.use('/quiz-questions', question_routes_1.default);
router.use('/exam-attempts', examAttempt_routes_1.default);
router.use('/answers', answer_routes_1.default);
// Assignment Management Routes
router.use('/assignments', assignment_routes_1.default);
router.use('/submissions', submission_routes_1.default);
// Communication System Routes
router.use('/notifications', notification_routes_1.default);
router.use('/announcements', announcement_routes_1.default);
router.use('/live-sessions', liveSession_routes_1.default);
router.use('/messages', message_routes_1.default);
router.use('/conversations', conversation_routes_1.default);
// Payment & Subscription System Routes
router.use('/subscriptions', subscription_routes_1.default);
router.use('/payments', payment_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/coupons', coupon_routes_1.default);
router.use('/invoices', invoice_routes_1.default);
// CMS & Website Management Routes
router.use('/cms', cmsAdmin_routes_1.default);
router.use('/categories', category_routes_1.default);
router.use('/pages', page_routes_1.default);
router.use('/banners', banner_routes_1.default);
router.use('/blogs', blog_routes_1.default);
router.use('/faqs', faq_routes_1.default);
router.use('/testimonials', testimonial_routes_1.default);
router.use('/contacts', contact_routes_1.default);
router.use('/menus', menu_routes_1.default);
router.use('/settings', settings_routes_1.default);
router.use('/seo', seo_routes_1.default);
router.use('/social-links', socialLinks_routes_1.default);
// Teacher Section, Lesson, Quiz, Assignment & Student Management Routes
router.use('/teacher/courses', course_routes_1.default);
router.use('/teacher/units', unit_routes_1.default);
router.use('/teacher', section_routes_1.default);
router.use('/teacher/lessons', lesson_routes_1.default);
router.use('/teacher/quizzes', quiz_routes_1.default);
router.use('/teacher/questions', quiz_routes_1.default);
router.use('/teacher/assignments', assignment_routes_1.default);
router.use('/teacher/submissions', submission_routes_1.default);
router.use('/teacher/students', student_routes_1.default);
router.use('/earnings', earnings_routes_1.default);
router.use('/', withdrawal_routes_1.default);
router.use('/teacher/settings', teacherSettings_routes_1.default);
router.use('/teacher/files', fileAsset_routes_1.default);
router.use('/teacher/search', search_routes_1.default);
router.use('/', review_routes_1.default);
router.use('/', teacherNotification_routes_1.default);
router.use('/', teacherProfile_routes_1.default);
// Dashboard & Analytics Routes
router.use('/dashboard', dashboard_routes_1.default);
router.use('/teacher/dashboard', dashboard_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
router.use('/reports', reports_routes_1.default);
router.use('/activity-logs', activityLog_routes_1.default);
router.use('/ai', ai_routes_1.default);
router.use('/teacher-applications', teacherApplication_routes_1.default);
// Teacher-facing application routes: POST /teacher/apply, GET /teacher/my-application, etc.
router.use('/teacher/apply', teacherApplication_routes_1.default);
router.use('/teacher/application', teacherApplication_routes_1.default);
// Admin-facing application routes: GET/PATCH /admin/teacher-applications/:id/approve etc.
router.use('/admin/teacher-applications', teacherApplication_routes_1.default);
exports.default = router;
