import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createBlogSchema, updateBlogSchema } from './blog.validation';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } from './blog.controller';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));
router.post('/', validationMiddleware({ body: createBlogSchema }), createBlog);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateBlogSchema }), updateBlog);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteBlog);

export default router;
