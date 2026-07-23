import { Schema, model } from 'mongoose';
import { IExamAttemptDocument } from './examAttempt.interface';

const examAttemptSchema = new Schema<IExamAttemptDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz reference is required'],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['InProgress', 'Submitted', 'Graded'],
      default: 'InProgress',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
examAttemptSchema.index({ studentId: 1 });
examAttemptSchema.index({ quizId: 1 });
examAttemptSchema.index({ status: 1 });
examAttemptSchema.index({ studentId: 1, quizId: 1 });

export const ExamAttempt = model<IExamAttemptDocument>('ExamAttempt', examAttemptSchema);
export default ExamAttempt;
