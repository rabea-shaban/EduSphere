import { Request, Response } from 'express';
import { Answer } from './answer.model';
import { ExamAttempt } from '../examAttempts/examAttempt.model';
import { Quiz } from '../quizzes/quiz.model';
import { Question } from '../questions/question.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Grade a student's answer manually (Teachers only).
 * Recalculates the parent attempt's total score, percentage, and passing status.
 */
export const gradeAnswer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // Answer ID
  const { marks, isCorrect } = req.body;

  const answer = await Answer.findById(id);
  if (!answer) {
    throw new ApiError(404, 'Answer not found');
  }

  // 1. Update Answer record
  answer.marks = marks;
  answer.isCorrect = isCorrect;
  await answer.save();

  // 2. Fetch parent attempt details
  const attempt = await ExamAttempt.findById(answer.attemptId);
  if (!attempt) {
    throw new ApiError(404, 'Parent exam attempt not found');
  }

  const quiz = await Quiz.findById(attempt.quizId);
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  // 3. Recalculate total score earned by student
  const allAnswers = await Answer.find({ attemptId: attempt._id });
  let totalStudentScore = 0;
  for (const ans of allAnswers) {
    totalStudentScore += ans.marks;
  }

  // 4. Sum quiz max marks
  const quizQuestions = await Question.find({ quizId: attempt.quizId });
  const totalQuizMaxMarks = quizQuestions.reduce((sum, q) => sum + q.marks, 0);

  // 5. Update parent attempt
  attempt.score = totalStudentScore;
  attempt.percentage = totalQuizMaxMarks > 0 ? Math.round((totalStudentScore / totalQuizMaxMarks) * 100) : 0;
  attempt.passed = attempt.percentage >= quiz.passingScore;
  attempt.status = 'Graded'; // Updated to Graded upon teacher evaluation

  await attempt.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        answer,
        attempt,
      },
      'Answer graded and attempt score updated successfully'
    )
  );
});
