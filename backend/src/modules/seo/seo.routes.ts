import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createSeoSchema, updateSeoSchema } from './seo.validation';
import { createSeo, getPageSeo, updateSeo } from './seo.controller';

const router = Router();

router.get('/', getPageSeo);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.post('/', validationMiddleware({ body: createSeoSchema }), createSeo);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateSeoSchema }), updateSeo);

export default router;
