"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeAnswer = void 0;
const answer_model_1 = require("./answer.model");
const examAttempt_model_1 = require("../examAttempts/examAttempt.model");
const quiz_model_1 = require("../quizzes/quiz.model");
const question_model_1 = require("../questions/question.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Grade a student's answer manually (Teachers only).
 * Recalculates the parent attempt's total score, percentage, and passing status.
 */
exports.gradeAnswer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // Answer ID
    const { marks, isCorrect } = req.body;
    const answer = await answer_model_1.Answer.findById(id);
    if (!answer) {
        throw new ApiError_1.ApiError(404, 'Answer not found');
    }
    // 1. Update Answer record
    answer.marks = marks;
    answer.isCorrect = isCorrect;
    await answer.save();
    // 2. Fetch parent attempt details
    const attempt = await examAttempt_model_1.ExamAttempt.findById(answer.attemptId);
    if (!attempt) {
        throw new ApiError_1.ApiError(404, 'Parent exam attempt not found');
    }
    const quiz = await quiz_model_1.Quiz.findById(attempt.quizId);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    // 3. Recalculate total score earned by student
    const allAnswers = await answer_model_1.Answer.find({ attemptId: attempt._id });
    let totalStudentScore = 0;
    for (const ans of allAnswers) {
        totalStudentScore += ans.marks;
    }
    // 4. Sum quiz max marks
    const quizQuestions = await question_model_1.Question.find({ quizId: attempt.quizId });
    const totalQuizMaxMarks = quizQuestions.reduce((sum, q) => sum + q.marks, 0);
    // 5. Update parent attempt
    attempt.score = totalStudentScore;
    attempt.percentage = totalQuizMaxMarks > 0 ? Math.round((totalStudentScore / totalQuizMaxMarks) * 100) : 0;
    attempt.passed = attempt.percentage >= quiz.passingScore;
    attempt.status = 'Graded'; // Updated to Graded upon teacher evaluation
    await attempt.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        answer,
        attempt,
    }, 'Answer graded and attempt score updated successfully'));
});
