import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema,
} from './quiz.validation';
import {
  getTeacherQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
  archiveQuiz,
  restoreQuiz,
  duplicateQuiz,
  getQuizQuestions,
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  reorderQuizQuestions,
  getQuizAnalytics,
  getQuizLeaderboard,
} from './quiz.controller';

const router = Router();

// Protected Teacher & Admin Routes
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

// ─── Quiz List & Create ───────────────────────────────────────────────────────
// Supports both mount points:
//   router.use('/quizzes', quizRoutes)  →  GET /quizzes      hits GET /
//   router.use('/teacher', quizRoutes)  →  GET /teacher/quizzes hits GET /quizzes
router.get('/', getTeacherQuizzes);
router.get('/quizzes', getTeacherQuizzes);

router.post('/', validationMiddleware({ body: createQuizSchema }), createQuiz);
router.post('/quizzes', validationMiddleware({ body: createQuizSchema }), createQuiz);

// ─── Question Reorder (must come before /:id) ────────────────────────────────
router.patch('/questions/reorder', validationMiddleware({ body: reorderQuestionsSchema }), reorderQuizQuestions);
router.patch('/quizzes/questions/reorder', validationMiddleware({ body: reorderQuestionsSchema }), reorderQuizQuestions);

// ─── Single Quiz CRUD ─────────────────────────────────────────────────────────
// Bare   /:id           → for mount at /quizzes  (e.g. GET /quizzes/:id)
// Prefix /quizzes/:id   → for mount at /teacher  (e.g. GET /teacher/quizzes/:id)
router.get('/:id',                   validationMiddleware({ params: userIdSchema }), getQuizById);
router.get('/quizzes/:id',           validationMiddleware({ params: userIdSchema }), getQuizById);

router.put('/:id',                   validationMiddleware({ params: userIdSchema, body: updateQuizSchema }), updateQuiz);
router.put('/quizzes/:id',           validationMiddleware({ params: userIdSchema, body: updateQuizSchema }), updateQuiz);

router.patch('/:id',                 validationMiddleware({ params: userIdSchema, body: updateQuizSchema }), updateQuiz);
router.patch('/quizzes/:id',         validationMiddleware({ params: userIdSchema, body: updateQuizSchema }), updateQuiz);

router.delete('/:id',                validationMiddleware({ params: userIdSchema }), deleteQuiz);
router.delete('/quizzes/:id',        validationMiddleware({ params: userIdSchema }), deleteQuiz);

// ─── Status Actions ───────────────────────────────────────────────────────────
router.patch('/:id/publish',         validationMiddleware({ params: userIdSchema }), publishQuiz);
router.patch('/quizzes/:id/publish', validationMiddleware({ params: userIdSchema }), publishQuiz);

router.patch('/:id/unpublish',         validationMiddleware({ params: userIdSchema }), unpublishQuiz);
router.patch('/quizzes/:id/unpublish', validationMiddleware({ params: userIdSchema }), unpublishQuiz);

router.patch('/:id/archive',         validationMiddleware({ params: userIdSchema }), archiveQuiz);
router.patch('/quizzes/:id/archive', validationMiddleware({ params: userIdSchema }), archiveQuiz);

router.patch('/:id/restore',         validationMiddleware({ params: userIdSchema }), restoreQuiz);
router.patch('/quizzes/:id/restore', validationMiddleware({ params: userIdSchema }), restoreQuiz);

router.post('/:id/duplicate',         validationMiddleware({ params: userIdSchema }), duplicateQuiz);
router.post('/quizzes/:id/duplicate', validationMiddleware({ params: userIdSchema }), duplicateQuiz);

// ─── Question CRUD Sub-routes ─────────────────────────────────────────────────
router.get('/:id/questions',                   validationMiddleware({ params: userIdSchema }), getQuizQuestions);
router.get('/quizzes/:id/questions',           validationMiddleware({ params: userIdSchema }), getQuizQuestions);

router.post('/:id/questions',                  validationMiddleware({ params: userIdSchema, body: createQuestionSchema }), addQuizQuestion);
router.post('/quizzes/:id/questions',          validationMiddleware({ params: userIdSchema, body: createQuestionSchema }), addQuizQuestion);

router.put('/questions/:id',                   validationMiddleware({ params: userIdSchema, body: updateQuestionSchema }), updateQuizQuestion);
router.delete('/questions/:id',                validationMiddleware({ params: userIdSchema }), deleteQuizQuestion);

// ─── Analytics & Leaderboard ──────────────────────────────────────────────────
router.get('/:id/analytics',         validationMiddleware({ params: userIdSchema }), getQuizAnalytics);
router.get('/quizzes/:id/analytics', validationMiddleware({ params: userIdSchema }), getQuizAnalytics);

router.get('/:id/leaderboard',         validationMiddleware({ params: userIdSchema }), getQuizLeaderboard);
router.get('/quizzes/:id/leaderboard', validationMiddleware({ params: userIdSchema }), getQuizLeaderboard);

export default router;

