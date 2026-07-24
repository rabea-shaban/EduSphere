import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import {
  aiChatSchema,
  aiQuizGenSchema,
  aiSummarizeSchema,
  aiAssignmentHelperSchema,
  aiEssayEvalSchema,
  aiModerateSchema,
  aiStudyPlanSchema,
} from './ai.validation';
import {
  chatWithAi,
  getChatHistory,
  generateQuiz,
  summarizeLesson,
  assignmentAssistant,
  evaluateEssay,
  getRecommendations,
  getAiAnalyticsInsights,
  moderateContent,
  generateStudyPlan,
} from './ai.controller';

// Apply slightly strict rate limiting on heavy AI completions
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: {
    success: false,
    message: 'Too many requests to AI services, please try again after 15 minutes',
  },
});

const router = Router();

router.use(protect, aiLimiter);

router.post('/chat', validationMiddleware({ body: aiChatSchema }), chatWithAi);
router.get('/chat/history', getChatHistory);

router.post('/generate-quiz', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), validationMiddleware({ body: aiQuizGenSchema }), generateQuiz);
router.post('/summarize-lesson', validationMiddleware({ body: aiSummarizeSchema }), summarizeLesson);
router.post('/assignment-hint', validationMiddleware({ body: aiAssignmentHelperSchema }), assignmentAssistant);
router.post('/evaluate-essay', validationMiddleware({ body: aiEssayEvalSchema }), evaluateEssay);
router.get('/recommendations', getRecommendations);
router.get('/analytics-insights', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getAiAnalyticsInsights);
router.post('/moderate', validationMiddleware({ body: aiModerateSchema }), moderateContent);
router.post('/study-plan', validationMiddleware({ body: aiStudyPlanSchema }), generateStudyPlan);

export default router;
