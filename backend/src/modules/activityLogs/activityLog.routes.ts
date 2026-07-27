import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { getAllLogs, getAuditLogStatistics, getLogById } from './activityLog.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllLogs);
router.get('/statistics', getAuditLogStatistics);
router.get('/:id', getLogById);

export default router;
