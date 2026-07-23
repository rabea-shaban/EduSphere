import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createAcademicYearSchema, updateAcademicYearSchema } from './academicYear.validation';
import {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademicYear,
  activateAcademicYear,
  deactivateAcademicYear,
} from './academicYear.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllAcademicYears);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getAcademicYearById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createAcademicYearSchema }), createAcademicYear);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateAcademicYearSchema }), updateAcademicYear);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteAcademicYear);
router.patch('/:id/activate', validationMiddleware({ params: userIdSchema }), activateAcademicYear);
router.patch('/:id/deactivate', validationMiddleware({ params: userIdSchema }), deactivateAcademicYear);

export default router;
