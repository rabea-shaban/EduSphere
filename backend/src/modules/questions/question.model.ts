import { Schema, model } from 'mongoose';
import { IQuestionDocument } from './question.interface';

const questionSchema = new Schema<IQuestionDocument>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz reference is required'],
    },
    questionBankId: {
      type: Schema.Types.ObjectId,
      ref: 'QuestionBank',
      required: [true, 'Question Bank reference is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    order: {
      type: Number,
      required: [true, 'Display order is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
questionSchema.index({ quizId: 1, questionBankId: 1 }, { unique: true });
questionSchema.index({ quizId: 1 });
questionSchema.index({ questionBankId: 1 });
questionSchema.index({ order: 1 });

export const Question = model<IQuestionDocument>('Question', questionSchema);
export default Question;
