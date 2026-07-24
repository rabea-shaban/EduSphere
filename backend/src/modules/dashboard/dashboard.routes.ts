import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { getDashboardData } from './dashboard.controller';

const router = Router();

router.get('/', protect, getDashboardData);

export default router;
