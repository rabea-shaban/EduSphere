"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const student_controller_1 = require("./student.controller");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
// ─── Teacher & Admin Scoped Student Routes ──────────────────────────────────
// List students
router.get('/', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudents);
router.get('/students', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudents);
router.get('/teacher/students', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudents);
// Student Sub-resources (must come before /:id)
router.get('/:id/progress', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentProgress);
router.get('/students/:id/progress', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentProgress);
router.get('/teacher/students/:id/progress', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentProgress);
router.get('/:id/enrollments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentEnrollments);
router.get('/students/:id/enrollments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentEnrollments);
router.get('/teacher/students/:id/enrollments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentEnrollments);
router.get('/:id/quizzes', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentQuizzes);
router.get('/students/:id/quizzes', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentQuizzes);
router.get('/teacher/students/:id/quizzes', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentQuizzes);
router.get('/:id/assignments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentAssignments);
router.get('/students/:id/assignments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentAssignments);
router.get('/teacher/students/:id/assignments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentAssignments);
router.get('/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentCertificates);
router.get('/students/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentCertificates);
router.get('/teacher/students/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentCertificates);
router.post('/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.issueStudentCertificate);
router.post('/students/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.issueStudentCertificate);
router.post('/teacher/students/:id/certificates', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.issueStudentCertificate);
router.get('/:id/activity', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentActivity);
router.get('/students/:id/activity', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentActivity);
router.get('/teacher/students/:id/activity', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentActivity);
router.post('/:id/notify', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.sendTeacherStudentNotification);
router.post('/students/:id/notify', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.sendTeacherStudentNotification);
router.post('/teacher/students/:id/notify', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.sendTeacherStudentNotification);
// Single student profile for teacher
router.get('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentById);
router.get('/students/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentById);
router.get('/teacher/students/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), student_controller_1.getTeacherStudentById);
// ─── Admin Only Student Account CRUD Routes ─────────────────────────────────
router.get('/admin/all', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.getAllStudents);
router.get('/:id/courses', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.getStudentCourses);
router.get('/:id/payments', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.getStudentPayments);
router.put('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.updateStudent);
router.patch('/:id/suspend', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.suspendStudent);
router.patch('/:id/activate', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.activateStudent);
router.patch('/:id/reset-password', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.resetStudentPassword);
router.delete('/:id', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN'), student_controller_1.softDeleteStudent);
exports.default = router;
