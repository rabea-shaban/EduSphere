import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createQuestionBankSchema, updateQuestionBankSchema } from './questionBank.validation';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions,
} from './questionBank.controller';

const router = Router();

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.get('/random', getRandomQuestions);
router.get('/', getAllQuestions);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getQuestionById);

router.post('/', validationMiddleware({ body: createQuestionBankSchema }), createQuestion);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateQuestionBankSchema }), updateQuestion);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteQuestion);

export default router;
