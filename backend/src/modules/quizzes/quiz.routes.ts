import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createQuizSchema, updateQuizSchema } from './quiz.validation';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizLeaderboard,
} from './quiz.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllQuizzes);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getQuizById);
router.get('/:id/leaderboard', protect, validationMiddleware({ params: userIdSchema }), getQuizLeaderboard);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createQuizSchema }), createQuiz);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateQuizSchema }), updateQuiz);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteQuiz);

export default router;
