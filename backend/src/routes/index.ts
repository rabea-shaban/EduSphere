import { Router, Request, Response } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';
import academicYearRoutes from '../modules/academicYears/academicYear.routes';
import gradeRoutes from '../modules/grades/grade.routes';
import termRoutes from '../modules/terms/term.routes';
import subjectRoutes from '../modules/subjects/subject.routes';
import courseRoutes from '../modules/courses/course.routes';
import unitRoutes from '../modules/units/unit.routes';
import lessonRoutes from '../modules/lessons/lesson.routes';
import enrollmentRoutes from '../modules/enrollments/enrollment.routes';
import progressRoutes from '../modules/progress/progress.routes';
import videoRoutes from '../modules/videos/video.routes';
import resourceRoutes from '../modules/resources/resource.routes';
import questionBankRoutes from '../modules/questionBank/questionBank.routes';
import quizRoutes from '../modules/quizzes/quiz.routes';
import quizQuestionRoutes from '../modules/questions/question.routes';
import examAttemptRoutes from '../modules/examAttempts/examAttempt.routes';
import answerRoutes from '../modules/answers/answer.routes';
import assignmentRoutes from '../modules/assignments/assignment.routes';
import submissionRoutes from '../modules/submissions/submission.routes';
import studentRoutes from '../modules/students/student.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import teacherNotificationRoutes from '../modules/notifications/teacherNotification.routes';
import teacherProfileRoutes from '../modules/teachers/teacherProfile.routes';
import announcementRoutes from '../modules/announcements/announcement.routes';
import liveSessionRoutes from '../modules/liveSessions/liveSession.routes';
import messageRoutes from '../modules/messages/message.routes';
import conversationRoutes from '../modules/conversations/conversation.routes';
import subscriptionPlanRoutes from '../modules/subscriptions/subscription.routes';
import paymentRoutes from '../modules/payments/payment.routes';
import earningsRoutes from '../modules/payments/earnings.routes';
import withdrawalRoutes from '../modules/payments/withdrawal.routes';
import reviewRoutes from '../modules/reviews/review.routes';
import transactionRoutes from '../modules/transactions/transaction.routes';
import couponRoutes from '../modules/coupons/coupon.routes';
import invoiceRoutes from '../modules/invoices/invoice.routes';
import categoryRoutes from '../modules/categories/category.routes';
import pageRoutes from '../modules/pages/page.routes';
import bannerRoutes from '../modules/banners/banner.routes';
import blogRoutes from '../modules/blogs/blog.routes';
import faqRoutes from '../modules/faqs/faq.routes';
import testimonialRoutes from '../modules/testimonials/testimonial.routes';
import contactRoutes from '../modules/contacts/contact.routes';
import menuRoutes from '../modules/menus/menu.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import seoRoutes from '../modules/seo/seo.routes';
import socialLinksRoutes from '../modules/socialLinks/socialLinks.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import reportsRoutes from '../modules/reports/reports.routes';
import activityLogRoutes from '../modules/activityLogs/activityLog.routes';
import aiRoutes from '../modules/ai/ai.routes';
import teacherApplicationRoutes from '../modules/teacherApplications/teacherApplication.routes';
import teacherAdminRoutes from '../modules/teachers/teacher.routes';
import studentAdminRoutes from '../modules/students/student.routes';
import courseAdminRoutes from '../modules/courses/courseAdmin.routes';
import paymentAdminRoutes from '../modules/payments/paymentAdmin.routes';
import categoryAdminRoutes from '../modules/categories/categoryAdmin.routes';
import couponAdminRoutes from '../modules/coupons/couponAdmin.routes';
import notificationAdminRoutes from '../modules/notifications/notificationAdmin.routes';
import reportAdminRoutes from '../modules/reports/reportAdmin.routes';
import cmsAdminRoutes from '../modules/cms/cmsAdmin.routes';
import platformSettingsRoutes from '../modules/settings/platformSettings.routes';
import roleAdminRoutes from '../modules/roles/roleAdmin.routes';
import uploadRoutes from '../modules/upload/upload.routes';
import sectionRoutes from '../modules/sections/section.routes';
import teacherSettingsRoutes from '../modules/settings/teacherSettings.routes';
import fileAssetRoutes from '../modules/upload/fileAsset.routes';
import teacherSearchRoutes from '../modules/search/search.routes';

const router = Router();

/**
 * @route   GET /
 * @desc    Health Check / Sample Route
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EduSphere Backend Running Successfully',
  });
});

// Authentication Routes
router.use('/auth', authRoutes);

// User Module Routes
router.use('/users', userRoutes);

// Admin Management Routes
router.use('/admin/teachers', teacherAdminRoutes);
router.use('/teachers', teacherAdminRoutes);
router.use('/admin/students', studentAdminRoutes);
router.use('/students', studentAdminRoutes);
router.use('/admin/courses', courseAdminRoutes);
router.use('/admin', paymentAdminRoutes);
router.use('/admin', categoryAdminRoutes);
router.use('/admin', couponAdminRoutes);
router.use('/admin/coupons', couponAdminRoutes);
router.use('/admin', notificationAdminRoutes);
router.use('/admin', reportAdminRoutes);
router.use('/admin', cmsAdminRoutes);
router.use('/admin', platformSettingsRoutes);
router.use('/admin', roleAdminRoutes);
router.use('/admin/audit-logs', activityLogRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/admin/blog', blogRoutes);
router.use('/admin/subscriptions', subscriptionPlanRoutes);

// Academic Structure Routes
router.use('/academic-years', academicYearRoutes);
router.use('/grades', gradeRoutes);
router.use('/terms', termRoutes);
router.use('/subjects', subjectRoutes);

// Course Management Routes
router.use('/courses', courseRoutes);
router.use('/units', unitRoutes);
router.use('/lessons', lessonRoutes);

// Enrollment & Progress Routes
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);

// Content Management Routes
router.use('/upload', uploadRoutes);
router.use('/videos', videoRoutes);
router.use('/resources', resourceRoutes);

// Assessment System Routes
router.use('/question-bank', questionBankRoutes);
router.use('/quizzes', quizRoutes);
router.use('/quiz-questions', quizQuestionRoutes);
router.use('/exam-attempts', examAttemptRoutes);
router.use('/answers', answerRoutes);

// Assignment Management Routes
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);

// Communication System Routes
router.use('/notifications', notificationRoutes);
router.use('/announcements', announcementRoutes);
router.use('/live-sessions', liveSessionRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes);

// Payment & Subscription System Routes
router.use('/subscriptions', subscriptionPlanRoutes);
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionRoutes);
router.use('/coupons', couponRoutes);
router.use('/invoices', invoiceRoutes);

// CMS & Website Management Routes
router.use('/cms', cmsAdminRoutes);
router.use('/categories', categoryRoutes);
router.use('/pages', pageRoutes);
router.use('/banners', bannerRoutes);
router.use('/blogs', blogRoutes);
router.use('/faqs', faqRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contacts', contactRoutes);
router.use('/menus', menuRoutes);
router.use('/settings', settingsRoutes);
router.use('/seo', seoRoutes);
router.use('/social-links', socialLinksRoutes);

// Teacher Section, Lesson, Quiz, Assignment & Student Management Routes
router.use('/teacher', sectionRoutes);
router.use('/teacher', lessonRoutes);
router.use('/teacher', quizRoutes);
router.use('/teacher', assignmentRoutes);
router.use('/teacher', submissionRoutes);
router.use('/teacher', studentRoutes);
router.use('/teacher', analyticsRoutes);
router.use('/teacher', earningsRoutes);
router.use('/teacher', withdrawalRoutes);
router.use('/teacher/settings', teacherSettingsRoutes);
router.use('/teacher/files', fileAssetRoutes);
router.use('/teacher/search', teacherSearchRoutes);
router.use('/', reviewRoutes);
router.use('/', teacherNotificationRoutes);
router.use('/', teacherProfileRoutes);

// Dashboard & Analytics Routes
router.use('/dashboard', dashboardRoutes);
router.use('/teacher/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportsRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/ai', aiRoutes);
router.use('/teacher-applications', teacherApplicationRoutes);

export default router;
