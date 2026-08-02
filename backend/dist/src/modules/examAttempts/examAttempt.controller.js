"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttemptDetails = exports.getAllAttempts = exports.getStudentAttempts = exports.submitAttempt = exports.startAttempt = void 0;
const examAttempt_model_1 = require("./examAttempt.model");
const quiz_model_1 = require("../quizzes/quiz.model");
const answer_model_1 = require("../answers/answer.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Start a new quiz attempt.
 */
exports.startAttempt = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // 1. Fetch Quiz details
    const quiz = await quiz_model_1.Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    if (quiz.status !== 'Published') {
        throw new ApiError_1.ApiError(400, 'Cannot take an unpublished quiz');
    }
    // 2. Check if student ALREADY completed this quiz
    const existingCompleted = await examAttempt_model_1.ExamAttempt.findOne({
        studentId,
        quizId,
        status: { $in: ['Submitted', 'Graded'] },
    });
    if (existingCompleted) {
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, { attempt: existingCompleted, isAlreadyCompleted: true }, 'Quiz already completed'));
    }
    // 3. Verify attempt limits
    const attemptCount = await examAttempt_model_1.ExamAttempt.countDocuments({ studentId, quizId });
    const allowedLimit = quiz.attemptLimit || 1;
    if (attemptCount >= allowedLimit) {
        throw new ApiError_1.ApiError(400, 'Quiz attempt limit exceeded');
    }
    // 4. Create attempt record
    const attempt = await examAttempt_model_1.ExamAttempt.create({
        studentId,
        quizId,
        startedAt: new Date(),
        status: 'InProgress',
    });
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, { attempt, isAlreadyCompleted: false }, 'Quiz attempt started successfully'));
});
/**
 * Submit answers and auto-grade objective questions.
 */
exports.submitAttempt = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // attempt ID or quiz ID
    const { quizId, score, percentage, passed, answers, timeTakenSeconds } = req.body;
    const studentId = req.user?._id;
    if (!studentId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    // Find attempt by ID or find/create attempt by studentId + quizId
    let attempt = await examAttempt_model_1.ExamAttempt.findById(id);
    const targetQuizId = quizId || (attempt ? attempt.quizId : id);
    if (!attempt && targetQuizId) {
        attempt = await examAttempt_model_1.ExamAttempt.findOne({ studentId, quizId: targetQuizId });
    }
    if (!attempt) {
        attempt = new examAttempt_model_1.ExamAttempt({
            studentId,
            quizId: targetQuizId,
            startedAt: new Date(),
        });
    }
    const quiz = await quiz_model_1.Quiz.findById(targetQuizId);
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
            const studentAns = answers.find((a) => String(a.questionId) === String(idx) || String(a.questionId) === String(q._id));
            if (studentAns) {
                let isCorrect = Boolean(studentAns.isCorrect);
                if (!isCorrect && studentAns.studentAnswer !== undefined && studentAns.studentAnswer !== null) {
                    const answerIdx = Number(studentAns.studentAnswer);
                    if (Array.isArray(q.options) && q.options[answerIdx] && q.options[answerIdx].isCorrect) {
                        isCorrect = true;
                    }
                    else if (q.correctAnswer !== undefined && String(studentAns.studentAnswer) === String(q.correctAnswer)) {
                        isCorrect = true;
                    }
                }
                if (isCorrect) {
                    earned += qMarks;
                }
            }
        });
        if (max > 0) {
            const calcPercentage = Math.round((earned / max) * 100);
            finalScore = Math.max(earned, finalScore);
            finalPercentage = Math.max(calcPercentage, finalPercentage);
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
    }
    else if (attempt.startedAt) {
        const elapsed = Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
        attempt.timeTakenSeconds = Math.max(1, elapsed);
    }
    await attempt.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { attempt }, 'Quiz attempt submitted and recorded successfully'));
});
/**
 * Get student attempts for a quiz (Student history).
 */
exports.getStudentAttempts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId } = req.query;
    const studentId = req.user?._id;
    const filter = { studentId };
    if (quizId) {
        filter.quizId = quizId;
    }
    const attempts = await examAttempt_model_1.ExamAttempt.find(filter)
        .populate('quizId', 'title duration passingScore')
        .sort({ startedAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, attempts, 'Attempts history retrieved successfully'));
});
/**
 * Get all attempts (Admins/Teachers).
 */
exports.getAllAttempts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { quizId, studentId, status } = req.query;
    const filter = {};
    if (quizId)
        filter.quizId = quizId;
    if (studentId)
        filter.studentId = studentId;
    if (status)
        filter.status = status;
    const attempts = await examAttempt_model_1.ExamAttempt.find(filter)
        .populate('studentId', 'firstName lastName email username')
        .populate('quizId', 'title courseId')
        .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, attempts, 'All attempts retrieved successfully'));
});
/**
 * Get attempt details along with detailed student answers.
 */
exports.getAttemptDetails = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const attempt = await examAttempt_model_1.ExamAttempt.findById(id)
        .populate('studentId', 'firstName lastName username avatar')
        .populate('quizId', 'title duration passingScore');
    if (!attempt) {
        throw new ApiError_1.ApiError(404, 'Attempt not found');
    }
    // Load detailed answers
    const answers = await answer_model_1.Answer.find({ attemptId: id })
        .populate('questionId', 'title question type options explanation');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        attempt,
        answers,
    }, 'Attempt details retrieved successfully'));
});
