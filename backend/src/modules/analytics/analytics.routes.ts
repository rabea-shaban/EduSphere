import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { getPlatformAnalytics } from './analytics.controller';

const router = Router();

router.get('/', protect, restrictTo('SUPER_ADMIN', 'ADMIN'), getPlatformAnalytics);

export default router;
