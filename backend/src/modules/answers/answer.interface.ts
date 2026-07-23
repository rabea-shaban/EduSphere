import { Document, Types } from 'mongoose';

export interface IAnswer {
  attemptId: Types.ObjectId;
  questionId: Types.ObjectId; // References QuestionBank
  studentAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  marks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnswerDocument extends IAnswer, Document {}
