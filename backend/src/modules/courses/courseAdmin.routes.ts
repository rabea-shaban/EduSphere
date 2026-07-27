import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllCoursesAdmin,
  getCourseByIdAdmin,
  getCourseEnrollmentsAdmin,
  updateCourseAdmin,
  approveCourseAdmin,
  rejectCourseAdmin,
  featureCourseAdmin,
  changeCourseStatusAdmin,
  softDeleteCourseAdmin,
} from './courseAdmin.controller';

const router = Router();

// Protect all routes to Super Admin & Admin only
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllCoursesAdmin);
router.get('/:id', getCourseByIdAdmin);
router.get('/:id/enrollments', getCourseEnrollmentsAdmin);

router.patch('/:id', updateCourseAdmin);
router.patch('/:id/approve', approveCourseAdmin);
router.patch('/:id/reject', rejectCourseAdmin);
router.patch('/:id/feature', featureCourseAdmin);
router.patch('/:id/status', changeCourseStatusAdmin);

router.delete('/:id', softDeleteCourseAdmin);

export default router;
