import { Schema, model } from 'mongoose';
import { IQuizDocument } from './quiz.interface';

const quizSchema = new Schema<IQuizDocument>(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    duration: {
      type: Number,
      default: 0, // in minutes (0 = unlimited)
    },
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      default: 50,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    shuffleAnswers: {
      type: Boolean,
      default: false,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    attemptLimit: {
      type: Number,
      default: 1,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizSchema.index({ courseId: 1 });
quizSchema.index({ lessonId: 1 });
quizSchema.index({ status: 1 });

export const Quiz = model<IQuizDocument>('Quiz', quizSchema);
export default Quiz;
