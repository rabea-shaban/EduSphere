import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createPageSchema, updatePageSchema } from './page.validation';
import { createPage, getAllPages, getPageById, updatePage, deletePage } from './page.controller';

const router = Router();

router.get('/', getAllPages);
router.get('/:id', getPageById);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.post('/', validationMiddleware({ body: createPageSchema }), createPage);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updatePageSchema }), updatePage);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deletePage);

export default router;
