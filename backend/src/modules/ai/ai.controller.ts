import { Request, Response } from 'express';
import { AiChatHistory, AiTokenUsage } from './ai.model';
import { aiProvider } from '../../config/ai';
import { cache } from '../../config/cache';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Log token usage helper.
 */
const trackTokenUsage = async (userId: any, orgId: any, feature: string, tokens: number) => {
  try {
    await AiTokenUsage.create({
      userId,
      organizationId: orgId,
      feature,
      tokensUsed: tokens,
    });
  } catch (error) {
    console.error('Failed to log token usage:', error);
  }
};

/**
 * 1. AI Chat (Ask questions, explain concepts, caches responses).
 */
export const chatWithAi = catchAsync(async (req: Request, res: Response) => {
  const { prompt, courseId } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  if (!userId) throw new ApiError(401, 'Unauthorized');

  // Check cache first
  const cacheKey = `ai_chat:${prompt.trim().toLowerCase()}`;
  const cachedResponse = await cache.get<string>(cacheKey);

  if (cachedResponse) {
    // Record cached access as 0 token use
    await trackTokenUsage(userId, orgId, 'aiChat:cache', 0);
    return res.status(200).json(new ApiResponse(200, { response: cachedResponse }, 'Response loaded from cache'));
  }

  // Live generation
  const sysMsg = 'You are an educational assistant for EduSphere. Explain concepts clearly, support multiple languages, and keep responses concise.';
  const result = await aiProvider.generateText(prompt, sysMsg);

  // Write cache
  await cache.set(cacheKey, result.text, 3600); // cache for 1 hour

  // Write history
  await AiChatHistory.create({
    userId,
    prompt,
    response: result.text,
    courseId,
  });

  // Track token usage
  await trackTokenUsage(userId, orgId, 'aiChat', result.tokensUsed);

  return res.status(200).json(new ApiResponse(200, { response: result.text }, 'AI Response generated successfully'));
});

/**
 * Get Paginated User Chat History.
 */
export const getChatHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const history = await AiChatHistory.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await AiChatHistory.countDocuments({ userId });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        history,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Chat history retrieved successfully'
    )
  );
});

/**
 * 2. Quiz Generator (Generate quiz questions).
 */
export const generateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { text, questionType, numberOfQuestions } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const prompt = `Generate a quiz with ${numberOfQuestions} questions of type ${questionType} based on this text:\n\n${text}\n\nInclude questions, type, options, and correctAnswers inside a "quizzes" array.`;
  const systemMessage = 'You are a quiz generation engine. Output only clean valid JSON matching the schema.';

  const result = await aiProvider.generateJson<{ quizzes: any[] }>(prompt, systemMessage);
  await trackTokenUsage(userId, orgId, 'aiQuizGenerator', 350);

  res.status(200).json(new ApiResponse(200, result, 'Quiz generated successfully'));
});

/**
 * 3. Lesson Summary (Create bulleted summaries, terms, and flashcards).
 */
export const summarizeLesson = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const cacheKey = `ai_summary:${text.trim().substring(0, 50).toLowerCase()}`;
  const cached = await cache.get<string>(cacheKey);

  if (cached) {
    return res.status(200).json(new ApiResponse(200, { summary: cached }, 'Summary loaded from cache'));
  }

  const prompt = `Summarize the following lesson content. Break it down into a Summary, Key Points, Flashcards (Q&A format), and Important Terms:\n\n${text}`;
  const systemMessage = 'You are an educational summarizer. Use clean, readable markdown.';

  const result = await aiProvider.generateText(prompt, systemMessage);
  await cache.set(cacheKey, result.text, 7200); // cache for 2 hours
  await trackTokenUsage(userId, orgId, 'aiLessonSummary', result.tokensUsed);

  return res.status(200).json(new ApiResponse(200, { summary: result.text }, 'Summary generated successfully'));
});

/**
 * 4. Assignment Assistant (Help students by giving hints/explanations without revealing the answer).
 */
export const assignmentAssistant = catchAsync(async (req: Request, res: Response) => {
  const { question } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const prompt = `Provide guidance, hints, and suggested references for this question:\n\n"${question}"`;
  const systemMessage = 'You are an assignment helper tutor. Your goal is to guide students to finding the answer themselves. NEVER provide the direct or final answer. Keep explanations generic.';

  const result = await aiProvider.generateText(prompt, systemMessage);
  await trackTokenUsage(userId, orgId, 'aiAssignmentAssistant', result.tokensUsed);

  res.status(200).json(new ApiResponse(200, { hint: result.text }, 'Assignment feedback generated'));
});

/**
 * 5. Essay Evaluation (Grade essays).
 */
export const evaluateEssay = catchAsync(async (req: Request, res: Response) => {
  const { essay } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const prompt = `Evaluate the following essay. Rate grammarScore, clarityScore, structureScore, and completenessScore out of 100, calculate a total score, and provide feedback review:\n\n"${essay}"`;
  const systemMessage = 'You are a professional academic grader. Respond only in clean valid JSON.';

  const result = await aiProvider.generateJson<any>(prompt, systemMessage);
  await trackTokenUsage(userId, orgId, 'aiEssayEvaluation', 400);

  res.status(200).json(new ApiResponse(200, result, 'Essay evaluation completed'));
});

/**
 * 6. Recommendations (Course/Quiz suggestions based on scores/progress).
 */
export const getRecommendations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  // Retrieve recommendations
  const prompt = `Recommend two advanced topics, lessons, or practice quizzes for student id ${userId} based on general proficiency metrics.`;
  const result = await aiProvider.generateJson<any>(prompt, 'You are a recommendation engine.');

  await trackTokenUsage(userId, orgId, 'aiRecommendations', 150);
  res.status(200).json(new ApiResponse(200, result, 'Recommendations retrieved successfully'));
});

/**
 * 7. AI Analytics Insights (At risk warnings and trends).
 */
export const getAiAnalyticsInsights = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const prompt = 'Analyze overall class progress and identify low-performing topics or at-risk student intervention alerts.';
  const result = await aiProvider.generateJson<any>(prompt, 'You are an education dashboard analyst.');

  await trackTokenUsage(userId, orgId, 'aiAnalytics', 200);
  res.status(200).json(new ApiResponse(200, result, 'Analytics insights generated'));
});

/**
 * 8. Content Moderation (Flag inappropriate text uploads).
 */
export const moderateContent = catchAsync(async (req: Request, res: Response) => {
  const { text } = req.body;
  const flagged = await aiProvider.moderateText(text);

  res.status(200).json(new ApiResponse(200, { flagged }, flagged ? 'Content flagged as inappropriate' : 'Content is clean'));
});

/**
 * 9. Study Planner (Generate personalized calendars/study plans).
 */
export const generateStudyPlan = catchAsync(async (req: Request, res: Response) => {
  const { examDate, weakSubjects, availableHoursPerDay } = req.body;
  const userId = req.user?._id;
  const orgId = (req.user as any)?.organizationId;

  const prompt = `Create a study timetable leading up to exam date ${examDate} focusing on weak subjects: ${weakSubjects.join(', ')} given ${availableHoursPerDay} hours available study time per day. Include day, subject, topic, and duration in a "studyPlan" array.`;
  const result = await aiProvider.generateJson<any>(prompt, 'You are a personalized study schedule planner.');

  await trackTokenUsage(userId, orgId, 'aiStudyPlanner', 300);
  res.status(200).json(new ApiResponse(200, result, 'Study plan generated successfully'));
});
