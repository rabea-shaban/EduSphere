import { Router } from 'express';
import { teacherRealtimeController } from './teacher-realtime.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/messages', teacherRealtimeController.sendMessage);
router.post('/calls/session', teacherRealtimeController.createCallSession);

export default router;
