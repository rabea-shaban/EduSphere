import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { getDashboardData } from './dashboard.controller';

const router = Router();

router.get('/', protect, getDashboardData);
router.get('/teacher', protect, getDashboardData);
router.get('/admin', protect, getDashboardData);
router.get('/student', protect, getDashboardData);
router.get('/stats', protect, getDashboardData);
router.get('/overview', protect, getDashboardData);

export default router;
