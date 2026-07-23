import { Request, Response } from 'express';
import { Quiz } from './quiz.model';
import { ExamAttempt } from '../examAttempts/examAttempt.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new quiz.
 */
export const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(new ApiResponse(201, quiz, 'Quiz created successfully'));
});

/**
 * Get all quizzes with filtering and pagination.
 */
export const getAllQuizzes = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, courseId, lessonId, status } = req.query;
  const filter: any = {};

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  if (courseId) filter.courseId = courseId;
  if (lessonId) filter.lessonId = lessonId;
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const quizzes = await Quiz.find(filter)
    .populate('courseId', 'title slug')
    .populate('lessonId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Quiz.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        quizzes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Quizzes retrieved successfully'
    )
  );
});

/**
 * Get Quiz by ID.
 */
export const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id)
    .populate('courseId', 'title slug')
    .populate('lessonId', 'title');

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz retrieved successfully'));
});

/**
 * Update Quiz details.
 */
export const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  Object.assign(quiz, req.body);
  await quiz.save();

  res.status(200).json(new ApiResponse(200, quiz, 'Quiz updated successfully'));
});

/**
 * Delete Quiz.
 */
export const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await Quiz.findByIdAndDelete(id);

  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Quiz deleted successfully'));
});

/**
 * Retrieve leaderboard ranking for a quiz.
 */
export const getQuizLeaderboard = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  // Find all graded/submitted attempts, rank by percentage (desc), then time elapsed (asc)
  const attempts = await ExamAttempt.find({
    quizId: id,
    status: { $in: ['Submitted', 'Graded'] },
  })
    .populate('studentId', 'firstName lastName username avatar')
    .lean();

  // Map to include timeTaken and sort manually for complex multi-key sorts
  const rankedList = attempts
    .map((attempt) => {
      const start = attempt.startedAt ? new Date(attempt.startedAt).getTime() : 0;
      const end = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : 0;
      const timeTaken = start && end ? Math.round((end - start) / 1000) : 0;

      return {
        student: attempt.studentId,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken, // in seconds
        passed: attempt.passed,
      };
    })
    .sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage; // High score first
      }
      return a.timeTaken - b.timeTaken; // Faster submission first
    });

  // Attach ranks
  const leaderboard = rankedList.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));

  res.status(200).json(new ApiResponse(200, leaderboard, 'Quiz leaderboard retrieved successfully'));
});
