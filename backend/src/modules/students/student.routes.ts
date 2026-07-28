import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllStudents,
  getStudentById,
  getStudentCourses,
  getStudentQuizzes,
  getStudentAssignments,
  getStudentCertificates,
  getStudentPayments,
  updateStudent,
  suspendStudent,
  activateStudent,
  resetStudentPassword,
  softDeleteStudent,
  sendStudentNotification,
  // Teacher-scoped handlers
  getTeacherStudents,
  getTeacherStudentById,
  getTeacherStudentProgress,
  getTeacherStudentEnrollments,
  getTeacherStudentQuizzes,
  getTeacherStudentAssignments,
  getTeacherStudentCertificates,
  issueStudentCertificate,
  getTeacherStudentActivity,
  sendTeacherStudentNotification,
} from './student.controller';

const router = Router();

router.use(protect);

// ─── Teacher & Admin Scoped Student Routes ──────────────────────────────────
// List students
router.get('/', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudents);
router.get('/students', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudents);
router.get('/teacher/students', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudents);

// Student Sub-resources (must come before /:id)
router.get('/:id/progress', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentProgress);
router.get('/students/:id/progress', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentProgress);
router.get('/teacher/students/:id/progress', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentProgress);

router.get('/:id/enrollments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentEnrollments);
router.get('/students/:id/enrollments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentEnrollments);
router.get('/teacher/students/:id/enrollments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentEnrollments);

router.get('/:id/quizzes', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentQuizzes);
router.get('/students/:id/quizzes', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentQuizzes);
router.get('/teacher/students/:id/quizzes', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentQuizzes);

router.get('/:id/assignments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAssignments);
router.get('/students/:id/assignments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAssignments);
router.get('/teacher/students/:id/assignments', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentAssignments);

router.get('/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentCertificates);
router.get('/students/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentCertificates);
router.get('/teacher/students/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentCertificates);

router.post('/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), issueStudentCertificate);
router.post('/students/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), issueStudentCertificate);
router.post('/teacher/students/:id/certificates', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), issueStudentCertificate);

router.get('/:id/activity', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentActivity);
router.get('/students/:id/activity', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentActivity);
router.get('/teacher/students/:id/activity', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentActivity);

router.post('/:id/notify', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), sendTeacherStudentNotification);
router.post('/students/:id/notify', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), sendTeacherStudentNotification);
router.post('/teacher/students/:id/notify', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), sendTeacherStudentNotification);

// Single student profile for teacher
router.get('/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentById);
router.get('/students/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentById);
router.get('/teacher/students/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getTeacherStudentById);

// ─── Admin Only Student Account CRUD Routes ─────────────────────────────────
router.get('/admin/all', restrictTo('SUPER_ADMIN', 'ADMIN'), getAllStudents);
router.get('/:id/courses', restrictTo('SUPER_ADMIN', 'ADMIN'), getStudentCourses);
router.get('/:id/payments', restrictTo('SUPER_ADMIN', 'ADMIN'), getStudentPayments);

router.put('/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), updateStudent);
router.patch('/:id/suspend', restrictTo('SUPER_ADMIN', 'ADMIN'), suspendStudent);
router.patch('/:id/activate', restrictTo('SUPER_ADMIN', 'ADMIN'), activateStudent);
router.patch('/:id/reset-password', restrictTo('SUPER_ADMIN', 'ADMIN'), resetStudentPassword);
router.delete('/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), softDeleteStudent);

export default router;
