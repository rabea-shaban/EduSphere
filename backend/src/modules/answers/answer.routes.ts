import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { gradeAnswerSchema } from './answer.validation';
import { gradeAnswer } from './answer.controller';

const router = Router();

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.patch('/:id/grade', validationMiddleware({ params: userIdSchema, body: gradeAnswerSchema }), gradeAnswer);

export default router;
