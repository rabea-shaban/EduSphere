"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuizQuestion = exports.updateQuizQuestion = exports.getQuizQuestionById = exports.getQuizQuestions = exports.bulkAddQuestions = exports.createQuizQuestion = void 0;
const question_model_1 = require("./question.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Assign a question to a quiz.
 */
exports.createQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId, questionBankId } = req.body;
    const existing = await question_model_1.Question.findOne({ quizId, questionBankId });
    if (existing) {
        throw new ApiError_1.ApiError(400, 'This question is already added to the quiz');
    }
    const quizQuestion = await question_model_1.Question.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, quizQuestion, 'Question bound to quiz successfully'));
});
/**
 * Bulk replace/add questions to a quiz.
 */
exports.bulkAddQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId, questions } = req.body;
    // Clear existing questions for this quiz to replace them
    await question_model_1.Question.deleteMany({ quizId });
    // Map and insert new questions
    const questionsToInsert = questions.map((q) => ({
        quizId,
        questionBankId: q.questionBankId,
        marks: q.marks,
        order: q.order,
    }));
    const inserted = await question_model_1.Question.insertMany(questionsToInsert);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, inserted, 'Quiz questions bulk added successfully'));
});
/**
 * Get all questions inside a quiz.
 */
exports.getQuizQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId } = req.query;
    const filter = {};
    if (quizId) {
        filter.quizId = quizId;
    }
    const questions = await question_model_1.Question.find(filter)
        .populate('questionBankId')
        .sort({ order: 1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, questions, 'Quiz questions retrieved successfully'));
});
/**
 * Get quiz question link by ID.
 */
exports.getQuizQuestionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quizQuestion = await question_model_1.Question.findById(id).populate('questionBankId');
    if (!quizQuestion) {
        throw new ApiError_1.ApiError(404, 'Quiz question relation not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quizQuestion, 'Quiz question retrieved successfully'));
});
/**
 * Update quiz question link.
 */
exports.updateQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quizQuestion = await question_model_1.Question.findById(id);
    if (!quizQuestion) {
        throw new ApiError_1.ApiError(404, 'Quiz question relation not found');
    }
    Object.assign(quizQuestion, req.body);
    await quizQuestion.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, quizQuestion, 'Quiz question updated successfully'));
});
/**
 * Delete question from quiz.
 */
exports.deleteQuizQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const quizQuestion = await question_model_1.Question.findByIdAndDelete(id);
    if (!quizQuestion) {
        throw new ApiError_1.ApiError(404, 'Quiz question relation not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Question removed from quiz successfully'));
});
