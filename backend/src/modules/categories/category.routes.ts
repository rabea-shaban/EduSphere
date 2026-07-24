import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createCategorySchema, updateCategorySchema } from './category.validation';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './category.controller';

const router = Router();

// Read routes (Public)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Write routes (admins only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.post('/', validationMiddleware({ body: createCategorySchema }), createCategory);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateCategorySchema }), updateCategory);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteCategory);

export default router;
