import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { updateSocialLinksSchema } from './socialLinks.validation';
import { getSocialLinks, updateSocialLinks } from './socialLinks.controller';

const router = Router();

router.get('/', getSocialLinks);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.patch('/', validationMiddleware({ body: updateSocialLinksSchema }), updateSocialLinks);

export default router;
