import { Request, Response } from 'express';
import { Question } from './question.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Assign a question to a quiz.
 */
export const createQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { quizId, questionBankId } = req.body;

  const existing = await Question.findOne({ quizId, questionBankId });
  if (existing) {
    throw new ApiError(400, 'This question is already added to the quiz');
  }

  const quizQuestion = await Question.create(req.body);
  res.status(201).json(new ApiResponse(201, quizQuestion, 'Question bound to quiz successfully'));
});

/**
 * Bulk replace/add questions to a quiz.
 */
export const bulkAddQuestions = catchAsync(async (req: Request, res: Response) => {
  const { quizId, questions } = req.body;

  // Clear existing questions for this quiz to replace them
  await Question.deleteMany({ quizId });

  // Map and insert new questions
  const questionsToInsert = questions.map((q: any) => ({
    quizId,
    questionBankId: q.questionBankId,
    marks: q.marks,
    order: q.order,
  }));

  const inserted = await Question.insertMany(questionsToInsert);

  res.status(201).json(new ApiResponse(201, inserted, 'Quiz questions bulk added successfully'));
});

/**
 * Get all questions inside a quiz.
 */
export const getQuizQuestions = catchAsync(async (req: Request, res: Response) => {
  const { quizId } = req.query;
  const filter: any = {};

  if (quizId) {
    filter.quizId = quizId;
  }

  const questions = await Question.find(filter)
    .populate('questionBankId')
    .sort({ order: 1 });

  res.status(200).json(new ApiResponse(200, questions, 'Quiz questions retrieved successfully'));
});

/**
 * Get quiz question link by ID.
 */
export const getQuizQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quizQuestion = await Question.findById(id).populate('questionBankId');

  if (!quizQuestion) {
    throw new ApiError(404, 'Quiz question relation not found');
  }

  res.status(200).json(new ApiResponse(200, quizQuestion, 'Quiz question retrieved successfully'));
});

/**
 * Update quiz question link.
 */
export const updateQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quizQuestion = await Question.findById(id);

  if (!quizQuestion) {
    throw new ApiError(404, 'Quiz question relation not found');
  }

  Object.assign(quizQuestion, req.body);
  await quizQuestion.save();

  res.status(200).json(new ApiResponse(200, quizQuestion, 'Quiz question updated successfully'));
});

/**
 * Delete question from quiz.
 */
export const deleteQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quizQuestion = await Question.findByIdAndDelete(id);

  if (!quizQuestion) {
    throw new ApiError(404, 'Quiz question relation not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Question removed from quiz successfully'));
});
