import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { createActivityLogSchema } from './activityLog.validation';
import { createLog, getAllLogs } from './activityLog.controller';

const router = Router();

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllLogs);
router.post('/', validationMiddleware({ body: createActivityLogSchema }), createLog);

export default router;
