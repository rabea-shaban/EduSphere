import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { startAttemptSchema, submitAttemptSchema } from './examAttempt.validation';
import {
  startAttempt,
  submitAttempt,
  getStudentAttempts,
  getAllAttempts,
  getAttemptDetails,
} from './examAttempt.controller';

const router = Router();

// Student attempt routes
router.post('/start', protect, validationMiddleware({ body: startAttemptSchema }), startAttempt);
router.post('/:id/submit', protect, validationMiddleware({ params: userIdSchema, body: submitAttemptSchema }), submitAttempt);
router.get('/history', protect, getStudentAttempts);

// Admin & Teacher endpoints
router.get('/', protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getAllAttempts);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getAttemptDetails);

export default router;
