"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizLeaderboard = exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getAllQuizzes = exports.createQuiz = void 0;
const quiz_model_1 = require("./quiz.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new quiz.
 */
exports.createQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const quiz = await quiz_model_1.Quiz.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, quiz, 'Quiz created successfully'));
});
/**
 * Get all quizzes with filtering and pagination.
 */
exports.getAllQuizzes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, courseId, lessonId, status } = req.query;
    const filter = {};
    if (search) {
        filter.title = new RegExp(search, 'i');
    }
    if (courseId)
        filter.courseId = courseId;
    if (lessonId)
        filter.lessonId = lessonId;
    if (status)
        filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const quizzes = await quiz_model_1.Quiz.find(filter)
        .populate('courseId', 'title slug')
        .populate('lessonId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await quiz_model_1.Quiz.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        quizzes,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Quizzes retrieved successfully'));
});
/**
 * Get Quiz by ID.
 */
exports.getQuizById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quiz = await quiz_model_1.Quiz.findById(id)
        .populate('courseId', 'title slug')
        .populate('lessonId', 'title');
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz retrieved successfully'));
});
/**
 * Update Quiz details.
 */
exports.updateQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quiz = await quiz_model_1.Quiz.findById(id);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    Object.assign(quiz, req.body);
    await quiz.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quiz, 'Quiz updated successfully'));
});
/**
 * Delete Quiz.
 */
exports.deleteQuiz = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quiz = await quiz_model_1.Quiz.findByIdAndDelete(id);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Quiz deleted successfully'));
});
/**
 * Retrieve leaderboard ranking for a quiz.
 */
exports.getQuizLeaderboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quiz = await quiz_model_1.Quiz.findById(id);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    // Find all graded/submitted attempts, rank by percentage (desc), then time elapsed (asc)
    const attempts = await examAttempt_model_1.ExamAttempt.find({
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, leaderboard, 'Quiz leaderboard retrieved successfully'));
});
