import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createLiveSessionSchema, updateLiveSessionSchema } from './liveSession.validation';
import {
  scheduleLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  updateLiveSession,
  cancelLiveSession,
  joinLiveSession,
  saveRecordingLink,
} from './liveSession.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllLiveSessions);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getLiveSessionById);
router.get('/:id/join', protect, validationMiddleware({ params: userIdSchema }), joinLiveSession);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createLiveSessionSchema }), scheduleLiveSession);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateLiveSessionSchema }), updateLiveSession);
router.patch('/:id/cancel', validationMiddleware({ params: userIdSchema }), cancelLiveSession);
router.patch('/:id/recording', validationMiddleware({ params: userIdSchema }), saveRecordingLink);

export default router;
