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
import notificationRoutes from '../modules/notifications/notification.routes';
import announcementRoutes from '../modules/announcements/announcement.routes';
import liveSessionRoutes from '../modules/liveSessions/liveSession.routes';
import messageRoutes from '../modules/messages/message.routes';
import subscriptionPlanRoutes from '../modules/subscriptions/subscription.routes';
import paymentRoutes from '../modules/payments/payment.routes';
import transactionRoutes from '../modules/transactions/transaction.routes';
import couponRoutes from '../modules/coupons/coupon.routes';
import invoiceRoutes from '../modules/invoices/invoice.routes';

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

// Payment & Subscription System Routes
router.use('/subscriptions', subscriptionPlanRoutes);
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionRoutes);
router.use('/coupons', couponRoutes);
router.use('/invoices', invoiceRoutes);

export default router;
