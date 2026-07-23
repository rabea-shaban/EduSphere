import { Document, Types } from 'mongoose';

export interface IQuestion {
  quizId: Types.ObjectId;
  questionBankId: Types.ObjectId;
  marks: number;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionDocument extends IQuestion, Document {}
