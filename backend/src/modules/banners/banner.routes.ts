import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createBannerSchema, updateBannerSchema } from './banner.validation';
import { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner } from './banner.controller';

const router = Router();

router.get('/', getAllBanners);
router.get('/:id', getBannerById);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.post('/', validationMiddleware({ body: createBannerSchema }), createBanner);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateBannerSchema }), updateBanner);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteBanner);

export default router;
