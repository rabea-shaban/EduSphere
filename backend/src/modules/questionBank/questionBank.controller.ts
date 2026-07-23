import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { QuestionBank } from './questionBank.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new question in the bank.
 */
export const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const questionData = { ...req.body };
  if (!questionData.teacher && req.user) {
    questionData.teacher = req.user._id;
  }

  const question = await QuestionBank.create(questionData);
  res.status(201).json(new ApiResponse(201, question, 'Question created in bank successfully'));
});

/**
 * Get all questions from the bank with search, pagination, and filters.
 */
export const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, difficulty, type, subjectId, gradeId, teacherId } = req.query;
  const filter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [{ title: searchRegex }, { question: searchRegex }, { tags: searchRegex }];
  }

  if (difficulty) filter.difficulty = difficulty;
  if (type) filter.type = type;
  if (subjectId) filter.subject = subjectId;
  if (gradeId) filter.grade = gradeId;
  if (teacherId) filter.teacher = teacherId;

  // Teachers can only view questions they created
  if (req.user && req.user.role === 'TEACHER') {
    filter.teacher = req.user._id;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const questions = await QuestionBank.find(filter)
    .populate('subject', 'name slug')
    .populate('grade', 'name')
    .populate('teacher', 'firstName lastName username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await QuestionBank.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        questions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Question Bank retrieved successfully'
    )
  );
});

/**
 * Get Question by ID.
 */
export const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await QuestionBank.findById(id)
    .populate('subject', 'name slug')
    .populate('grade', 'name')
    .populate('teacher', 'firstName lastName username');

  if (!question) {
    throw new ApiError(404, 'Question not found in bank');
  }

  res.status(200).json(new ApiResponse(200, question, 'Question retrieved successfully'));
});

/**
 * Update Question in bank.
 */
export const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await QuestionBank.findById(id);

  if (!question) {
    throw new ApiError(404, 'Question not found in bank');
  }

  // Verify ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && question.teacher.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this question');
  }

  Object.assign(question, req.body);
  await question.save();

  res.status(200).json(new ApiResponse(200, question, 'Question updated successfully'));
});

/**
 * Delete Question from bank.
 */
export const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await QuestionBank.findById(id);

  if (!question) {
    throw new ApiError(404, 'Question not found in bank');
  }

  // Verify ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && question.teacher.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to delete this question');
  }

  await question.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Question deleted from bank successfully'));
});

/**
 * Retrieve N random active questions from the question bank matching criteria.
 */
export const getRandomQuestions = catchAsync(async (req: Request, res: Response) => {
  const { limit = 5, subjectId, gradeId, difficulty, tags } = req.query;
  const match: any = { status: 'Active' };

  if (subjectId) match.subject = new Types.ObjectId(subjectId as string);
  if (gradeId) match.grade = new Types.ObjectId(gradeId as string);
  if (difficulty) match.difficulty = difficulty;

  if (tags) {
    const tagList = (tags as string).split(',').map((t) => t.trim());
    match.tags = { $in: tagList };
  }

  // Draw N random questions using MongoDB $sample aggregation
  const questions = await QuestionBank.aggregate([
    { $match: match },
    { $sample: { size: Number(limit) } },
  ]);

  res.status(200).json(new ApiResponse(200, questions, 'Random questions retrieved successfully'));
});
