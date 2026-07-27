import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
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
} from './student.controller';

const router = Router();

// Protect all routes to Super Admin & Admin only
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllStudents);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getStudentById);
router.patch('/:id', validationMiddleware({ params: userIdSchema }), updateStudent);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), softDeleteStudent);

router.get('/:id/courses', validationMiddleware({ params: userIdSchema }), getStudentCourses);
router.get('/:id/quizzes', validationMiddleware({ params: userIdSchema }), getStudentQuizzes);
router.get('/:id/assignments', validationMiddleware({ params: userIdSchema }), getStudentAssignments);
router.get('/:id/certificates', validationMiddleware({ params: userIdSchema }), getStudentCertificates);
router.get('/:id/payments', validationMiddleware({ params: userIdSchema }), getStudentPayments);

router.patch('/:id/suspend', validationMiddleware({ params: userIdSchema }), suspendStudent);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateStudent);
router.patch('/:id/reset-password', validationMiddleware({ params: userIdSchema }), resetStudentPassword);
router.post('/:id/notify', validationMiddleware({ params: userIdSchema }), sendStudentNotification);

export default router;
