import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getAllCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllSubjectsAdmin,
  createSubjectAdmin,
  updateSubjectAdmin,
  deleteSubjectAdmin,
  getAllGradesAdmin,
  createGradeAdmin,
  updateGradeAdmin,
  deleteGradeAdmin,
} from './categoryAdmin.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

// Categories Endpoints
router.get('/categories', getAllCategoriesAdmin);
router.post('/categories', createCategoryAdmin);
router.patch('/categories/:id', updateCategoryAdmin);
router.delete('/categories/:id', deleteCategoryAdmin);

// Subjects Endpoints
router.get('/subjects', getAllSubjectsAdmin);
router.post('/subjects', createSubjectAdmin);
router.patch('/subjects/:id', updateSubjectAdmin);
router.delete('/subjects/:id', deleteSubjectAdmin);

// Grades Endpoints
router.get('/grades', getAllGradesAdmin);
router.post('/grades', createGradeAdmin);
router.patch('/grades/:id', updateGradeAdmin);
router.delete('/grades/:id', deleteGradeAdmin);

export default router;
