"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const ai_validation_1 = require("./ai.validation");
const ai_controller_1 = require("./ai.controller");
// Apply slightly strict rate limiting on heavy AI completions
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 requests per window
    message: {
        success: false,
        message: 'Too many requests to AI services, please try again after 15 minutes',
    },
});
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect, aiLimiter);
router.post('/chat', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiChatSchema }), ai_controller_1.chatWithAi);
router.get('/chat/history', ai_controller_1.getChatHistory);
router.post('/generate-quiz', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiQuizGenSchema }), ai_controller_1.generateQuiz);
router.post('/summarize-lesson', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiSummarizeSchema }), ai_controller_1.summarizeLesson);
router.post('/assignment-hint', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiAssignmentHelperSchema }), ai_controller_1.assignmentAssistant);
router.post('/evaluate-essay', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiEssayEvalSchema }), ai_controller_1.evaluateEssay);
router.get('/recommendations', ai_controller_1.getRecommendations);
router.get('/analytics-insights', (0, authMiddleware_1.restrictTo)('SUPER_ADMIN', 'ADMIN', 'TEACHER'), ai_controller_1.getAiAnalyticsInsights);
router.post('/moderate', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiModerateSchema }), ai_controller_1.moderateContent);
router.post('/study-plan', (0, validationMiddleware_1.validationMiddleware)({ body: ai_validation_1.aiStudyPlanSchema }), ai_controller_1.generateStudyPlan);
exports.default = router;
