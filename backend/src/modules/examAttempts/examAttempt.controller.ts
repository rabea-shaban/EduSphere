import { Request, Response } from 'express';
import { ExamAttempt } from './examAttempt.model';
import { Quiz } from '../quizzes/quiz.model';
import { Answer } from '../answers/answer.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Start a new quiz attempt.
 */
export const startAttempt = catchAsync(async (req: Request, res: Response) => {
  const { quizId } = req.body;
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // 1. Fetch Quiz details
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  if (quiz.status !== 'Published') {
    throw new ApiError(400, 'Cannot take an unpublished quiz');
  }

  // 2. Check if student ALREADY completed this quiz
  const existingCompleted = await ExamAttempt.findOne({
    studentId,
    quizId,
    status: { $in: ['Submitted', 'Graded'] },
  });

  if (existingCompleted) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { attempt: existingCompleted, isAlreadyCompleted: true },
        'Quiz already completed'
      )
    );
  }

  // 3. Verify attempt limits
  const attemptCount = await ExamAttempt.countDocuments({ studentId, quizId });
  const allowedLimit = quiz.attemptLimit || 1;
  if (attemptCount >= allowedLimit) {
    throw new ApiError(400, 'Quiz attempt limit exceeded');
  }

  // 4. Create attempt record
  const attempt = await ExamAttempt.create({
    studentId,
    quizId,
    startedAt: new Date(),
    status: 'InProgress',
  });

  return res.status(201).json(new ApiResponse(201, { attempt, isAlreadyCompleted: false }, 'Quiz attempt started successfully'));
});

/**
 * Submit answers and auto-grade objective questions.
 */
export const submitAttempt = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // attempt ID or quiz ID
  const { quizId, score, percentage, passed, answers, timeTakenSeconds } = req.body;
  const studentId = req.user?._id;

  if (!studentId) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Find attempt by ID or find/create attempt by studentId + quizId
  let attempt = await ExamAttempt.findById(id);

  const targetQuizId = quizId || (attempt ? attempt.quizId : id);
  if (!attempt && targetQuizId) {
    attempt = await ExamAttempt.findOne({ studentId, quizId: targetQuizId });
  }

  if (!attempt) {
    attempt = new ExamAttempt({
      studentId,
      quizId: targetQuizId,
      startedAt: new Date(),
    });
  }

  const quiz = await Quiz.findById(targetQuizId);
  const passingScore = quiz?.passingScore ?? 50;

  // Auto calculate score if questions are embedded on quiz
  let finalScore = Number(score) || 0;
  let finalPercentage = Number(percentage) || 0;

  if (quiz && quiz.questions && quiz.questions.length > 0 && Array.isArray(answers) && answers.length > 0) {
    let earned = 0;
    let max = 0;
    quiz.questions.forEach((q, idx) => {
      const qMarks = q.marks || 1;
      max += qMarks;
      const studentAns = answers.find((a: any) => String(a.questionId) === String(idx) || String(a.questionId) === String(q._id));
      if (studentAns && String(studentAns.studentAnswer) === String(q.correctAnswer)) {
        earned += qMarks;
      }
    });
    if (max > 0) {
      finalScore = earned;
      finalPercentage = Math.round((earned / max) * 100);
    }
  }

  const isPassed = passed !== undefined ? passed : finalPercentage >= passingScore;

  attempt.score = finalScore;
  attempt.percentage = finalPercentage;
  attempt.passed = isPassed;
  attempt.status = 'Graded';
  attempt.submittedAt = new Date();

  if (timeTakenSeconds !== undefined) {
    attempt.timeTakenSeconds = Math.max(0, Number(timeTakenSeconds) || 0);
  } else if (attempt.startedAt) {
    const elapsed = Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
    attempt.timeTakenSeconds = Math.max(1, elapsed);
  }

  await attempt.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { attempt },
      'Quiz attempt submitted and recorded successfully'
    )
  );
});

/**
 * Get student attempts for a quiz (Student history).
 */
export const getStudentAttempts = catchAsync(async (req: Request, res: Response) => {
  const { quizId } = req.query;
  const studentId = req.user?._id;

  const filter: any = { studentId };
  if (quizId) {
    filter.quizId = quizId;
  }

  const attempts = await ExamAttempt.find(filter)
    .populate('quizId', 'title duration passingScore')
    .sort({ startedAt: -1 });

  res.status(200).json(new ApiResponse(200, attempts, 'Attempts history retrieved successfully'));
});

/**
 * Get all attempts (Admins/Teachers).
 */
export const getAllAttempts = catchAsync(async (req: Request, res: Response) => {
  const { quizId, studentId, status } = req.query;
  const filter: any = {};

  if (quizId) filter.quizId = quizId;
  if (studentId) filter.studentId = studentId;
  if (status) filter.status = status;

  const attempts = await ExamAttempt.find(filter)
    .populate('studentId', 'firstName lastName email username')
    .populate('quizId', 'title courseId')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, attempts, 'All attempts retrieved successfully'));
});

/**
 * Get attempt details along with detailed student answers.
 */
export const getAttemptDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const attempt = await ExamAttempt.findById(id)
    .populate('studentId', 'firstName lastName username avatar')
    .populate('quizId', 'title duration passingScore');

  if (!attempt) {
    throw new ApiError(404, 'Attempt not found');
  }

  // Load detailed answers
  const answers = await Answer.find({ attemptId: id })
    .populate('questionId', 'title question type options explanation');

  res.status(200).json(
    new ApiResponse(
      200,
      {
        attempt,
        answers,
      },
      'Attempt details retrieved successfully'
    )
  );
});
