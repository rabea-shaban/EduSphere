import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { getReportsSummary, exportPaymentsReport } from './reports.controller';

const router = Router();

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getReportsSummary);
router.get('/export', exportPaymentsReport);

export default router;
