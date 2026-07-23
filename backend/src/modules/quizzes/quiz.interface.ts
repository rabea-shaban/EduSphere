import { Document, Types } from 'mongoose';

export type QuizStatus = 'Draft' | 'Published';

export interface IQuiz {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  lessonId?: Types.ObjectId;
  duration: number; // in minutes (0 = unlimited)
  passingScore: number; // passing score (e.g. 50 out of 100)
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  negativeMarking: boolean;
  attemptLimit: number; // default 1
  startDate?: Date;
  endDate?: Date;
  status: QuizStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizDocument extends IQuiz, Document {}
