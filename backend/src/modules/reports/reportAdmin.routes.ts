import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getReportsDashboardAdmin,
  getRevenueReportAdmin,
  getStudentReportAdmin,
  getTeacherReportAdmin,
} from './reportAdmin.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/reports/dashboard', getReportsDashboardAdmin);
router.get('/reports/revenue', getRevenueReportAdmin);
router.get('/reports/students', getStudentReportAdmin);
router.get('/reports/teachers', getTeacherReportAdmin);

export default router;
