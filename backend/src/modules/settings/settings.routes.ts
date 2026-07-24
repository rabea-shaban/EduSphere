import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { updateSettingsSchema } from './settings.validation';
import { getGeneralSettings, updateGeneralSettings } from './settings.controller';

const router = Router();

router.get('/', getGeneralSettings);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.patch('/', validationMiddleware({ body: updateSettingsSchema }), updateGeneralSettings);

export default router;
