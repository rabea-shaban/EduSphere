"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttemptDetails = exports.getAllAttempts = exports.getStudentAttempts = exports.submitAttempt = exports.startAttempt = void 0;
const examAttempt_model_1 = require("./examAttempt.model");
const quiz_model_1 = require("../quizzes/quiz.model");
const question_model_1 = require("../questions/question.model");
const answer_model_1 = require("../answers/answer.model");
const enrollment_model_1 = require("../enrollments/enrollment.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Helper function to auto-correct objective questions.
 */
const evaluateAnswer = (type, studentAns, correctAns) => {
    if (['MCQ', 'True False', 'Fill Blank'].includes(type)) {
        return String(studentAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase();
    }
    if (type === 'Multiple Answers') {
        if (!Array.isArray(studentAns) || !Array.isArray(correctAns))
            return false;
        if (studentAns.length !== correctAns.length)
            return false;
        const sSorted = [...studentAns].map((s) => String(s).trim().toLowerCase()).sort();
        const cSorted = [...correctAns].map((c) => String(c).trim().toLowerCase()).sort();
        return sSorted.every((val, index) => val === cSorted[index]);
    }
    if (['Matching', 'Ordering'].includes(type)) {
        return JSON.stringify(studentAns) === JSON.stringify(correctAns);
    }
    // Subjective questions (Short Answer, Essay) cannot be auto-corrected
    return false;
};
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
    // 2. Verify student enrollment in the course
    const enrollment = await enrollment_model_1.Enrollment.findOne({
        studentId,
        courseId: quiz.courseId,
        status: { $in: ['Active', 'Completed'] },
    });
    if (!enrollment) {
        throw new ApiError_1.ApiError(403, 'You must be enrolled in the course to take this quiz');
    }
    // 3. Verify attempt limits
    const attemptCount = await examAttempt_model_1.ExamAttempt.countDocuments({ studentId, quizId });
    if (attemptCount >= quiz.attemptLimit) {
        throw new ApiError_1.ApiError(400, 'Quiz attempt limit exceeded');
    }
    // 4. Create attempt record
    const attempt = await examAttempt_model_1.ExamAttempt.create({
        studentId,
        quizId,
        startedAt: new Date(),
        status: 'InProgress',
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, attempt, 'Quiz attempt started successfully'));
});
/**
 * Submit answers and auto-grade objective questions.
 */
exports.submitAttempt = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // attempt ID
    const { answers } = req.body; // array of { questionId, studentAnswer }
    const attempt = await examAttempt_model_1.ExamAttempt.findById(id);
    if (!attempt) {
        throw new ApiError_1.ApiError(404, 'Exam attempt not found');
    }
    if (attempt.status !== 'InProgress') {
        throw new ApiError_1.ApiError(400, 'This attempt is already submitted or graded');
    }
    // Verify ownership
    if (req.user && req.user.role === 'STUDENT' && attempt.studentId.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You do not have permission to submit this attempt');
    }
    const quiz = await quiz_model_1.Quiz.findById(attempt.quizId);
    if (!quiz) {
        throw new ApiError_1.ApiError(404, 'Quiz not found');
    }
    // Load all questions bound to this quiz (populate question bank details)
    const quizQuestions = await question_model_1.Question.find({ quizId: attempt.quizId }).populate('questionBankId');
    let totalStudentScore = 0;
    let totalQuizMaxMarks = 0;
    let hasSubjectiveQuestions = false;
    const answersToInsert = [];
    for (const qq of quizQuestions) {
        const qb = qq.questionBankId;
        if (!qb)
            continue;
        totalQuizMaxMarks += qq.marks;
        // Find the student's answer for this question
        const submission = answers.find((ans) => ans.questionId === qb._id.toString());
        const studentAnswer = submission ? submission.studentAnswer : null;
        let isCorrect = false;
        let earnedMarks = 0;
        const isSubjective = ['Short Answer', 'Essay'].includes(qb.type);
        if (isSubjective) {
            hasSubjectiveQuestions = true;
            isCorrect = false;
            earnedMarks = 0; // subjective marks default to 0 pending manual grading
        }
        else {
            isCorrect = evaluateAnswer(qb.type, studentAnswer, qb.correctAnswer);
            earnedMarks = isCorrect ? qq.marks : 0;
            totalStudentScore += earnedMarks;
        }
        answersToInsert.push({
            attemptId: attempt._id,
            questionId: qb._id,
            studentAnswer,
            correctAnswer: qb.correctAnswer,
            isCorrect,
            marks: earnedMarks,
        });
    }
    // Insert answers to database
    await answer_model_1.Answer.insertMany(answersToInsert);
    // Update attempt status and percentage
    attempt.score = totalStudentScore;
    attempt.percentage = totalQuizMaxMarks > 0 ? Math.round((totalStudentScore / totalQuizMaxMarks) * 100) : 0;
    attempt.passed = attempt.percentage >= quiz.passingScore;
    attempt.status = hasSubjectiveQuestions ? 'Submitted' : 'Graded';
    attempt.submittedAt = new Date();
    await attempt.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        attempt,
        hasSubjectiveQuestions,
        message: hasSubjectiveQuestions
            ? 'Quiz submitted. Subjective questions are pending teacher grading.'
            : 'Quiz auto-corrected and graded successfully.',
    }, 'Quiz attempt submitted successfully'));
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
