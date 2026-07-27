import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from './blog.controller';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes for Admin & Teachers
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', createBlog);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
