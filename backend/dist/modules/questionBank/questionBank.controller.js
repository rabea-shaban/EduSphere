"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomQuestions = exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.getAllQuestions = exports.createQuestion = void 0;
const mongoose_1 = require("mongoose");
const questionBank_model_1 = require("./questionBank.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Create a new question in the bank.
 */
exports.createQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const questionData = { ...req.body };
    if (!questionData.teacher && req.user) {
        questionData.teacher = req.user._id;
    }
    const question = await questionBank_model_1.QuestionBank.create(questionData);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, question, 'Question created in bank successfully'));
});
/**
 * Get all questions from the bank with search, pagination, and filters.
 */
exports.getAllQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, search, difficulty, type, subjectId, gradeId, teacherId } = req.query;
    const filter = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ title: searchRegex }, { question: searchRegex }, { tags: searchRegex }];
    }
    if (difficulty)
        filter.difficulty = difficulty;
    if (type)
        filter.type = type;
    if (subjectId)
        filter.subject = subjectId;
    if (gradeId)
        filter.grade = gradeId;
    if (teacherId)
        filter.teacher = teacherId;
    // Teachers can only view questions they created
    if (req.user && req.user.role === 'TEACHER') {
        filter.teacher = req.user._id;
    }
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    const questions = await questionBank_model_1.QuestionBank.find(filter)
        .populate('subject', 'name slug')
        .populate('grade', 'name')
        .populate('teacher', 'firstName lastName username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await questionBank_model_1.QuestionBank.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        questions,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Question Bank retrieved successfully'));
});
/**
 * Get Question by ID.
 */
exports.getQuestionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const question = await questionBank_model_1.QuestionBank.findById(id)
        .populate('subject', 'name slug')
        .populate('grade', 'name')
        .populate('teacher', 'firstName lastName username');
    if (!question) {
        throw new ApiError_1.ApiError(404, 'Question not found in bank');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, question, 'Question retrieved successfully'));
});
/**
 * Update Question in bank.
 */
exports.updateQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const question = await questionBank_model_1.QuestionBank.findById(id);
    if (!question) {
        throw new ApiError_1.ApiError(404, 'Question not found in bank');
    }
    // Verify ownership if teacher
    if (req.user && req.user.role === 'TEACHER' && question.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to modify this question');
    }
    Object.assign(question, req.body);
    await question.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, question, 'Question updated successfully'));
});
/**
 * Delete Question from bank.
 */
exports.deleteQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const question = await questionBank_model_1.QuestionBank.findById(id);
    if (!question) {
        throw new ApiError_1.ApiError(404, 'Question not found in bank');
    }
    // Verify ownership if teacher
    if (req.user && req.user.role === 'TEACHER' && question.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to delete this question');
    }
    await question.deleteOne();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Question deleted from bank successfully'));
});
/**
 * Retrieve N random active questions from the question bank matching criteria.
 */
exports.getRandomQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { limit = 5, subjectId, gradeId, difficulty, tags } = req.query;
    const match = { status: 'Active' };
    if (subjectId)
        match.subject = new mongoose_1.Types.ObjectId(subjectId);
    if (gradeId)
        match.grade = new mongoose_1.Types.ObjectId(gradeId);
    if (difficulty)
        match.difficulty = difficulty;
    if (tags) {
        const tagList = tags.split(',').map((t) => t.trim());
        match.tags = { $in: tagList };
    }
    // Draw N random questions using MongoDB $sample aggregation
    const questions = await questionBank_model_1.QuestionBank.aggregate([
        { $match: match },
        { $sample: { size: Number(limit) } },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, questions, 'Random questions retrieved successfully'));
});
