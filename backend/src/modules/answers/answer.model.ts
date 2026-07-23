import { Schema, model } from 'mongoose';
import { IAnswerDocument } from './answer.interface';

const answerSchema = new Schema<IAnswerDocument>(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: 'ExamAttempt',
      required: [true, 'Exam attempt reference is required'],
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'QuestionBank',
      required: [true, 'Question reference is required'],
    },
    studentAnswer: {
      type: Schema.Types.Mixed,
    },
    correctAnswer: {
      type: Schema.Types.Mixed,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    marks: {
      type: Number,
      default: 0,
      min: [0, 'Marks cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
answerSchema.index({ attemptId: 1 });
answerSchema.index({ questionId: 1 });
answerSchema.index({ attemptId: 1, questionId: 1 }, { unique: true });

export const Answer = model<IAnswerDocument>('Answer', answerSchema);
export default Answer;
