import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createQuizQuestionSchema,
  updateQuizQuestionSchema,
  bulkAddQuizQuestionsSchema,
} from './question.validation';
import {
  createQuizQuestion,
  bulkAddQuestions,
  getQuizQuestions,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
} from './question.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getQuizQuestions);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getQuizQuestionById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createQuizQuestionSchema }), createQuizQuestion);
router.post('/bulk', validationMiddleware({ body: bulkAddQuizQuestionsSchema }), bulkAddQuestions);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateQuizQuestionSchema }), updateQuizQuestion);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteQuizQuestion);

export default router;
