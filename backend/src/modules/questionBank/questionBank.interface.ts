import { Document, Types } from 'mongoose';

export type QuestionType = 'MCQ' | 'Multiple Answers' | 'True False' | 'Fill Blank' | 'Short Answer' | 'Essay' | 'Matching' | 'Ordering';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionStatus = 'Active' | 'Draft';

export interface IQuestionBank {
  title: string;
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  subject: Types.ObjectId;
  grade: Types.ObjectId;
  teacher: Types.ObjectId;
  lesson?: Types.ObjectId;
  course?: Types.ObjectId;
  options: string[];
  correctAnswer: any; // Can be string, array of strings, or custom matching mappings
  marks: number;
  explanation?: string;
  tags: string[];
  status: QuestionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionBankDocument extends IQuestionBank, Document {}
