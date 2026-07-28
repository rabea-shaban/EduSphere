import { Document, Types } from 'mongoose';

export type QuizStatus = 'Draft' | 'Published' | 'Archived';

export type QuestionType =
  | 'SingleChoice'
  | 'MultipleChoice'
  | 'TrueFalse'
  | 'ShortAnswer'
  | 'Essay'
  | 'FillBlank'
  | 'Matching'
  | 'Ordering'
  | 'Numeric'
  | 'FileUpload'
  | 'MCQ'; // backward compatibility

export interface IAnswerOption {
  _id?: string;
  id?: string;
  text: string;
  isCorrect?: boolean;
  order?: number;
  matchingPair?: string;
}

export interface IQuizQuestion {
  _id?: string;
  id?: string;
  question: string;
  instructions?: string;
  type: QuestionType;
  marks: number;
  explanation?: string;
  order: number;
  options?: IAnswerOption[];
  correctAnswer?: any;
  numericAnswer?: number;
  numericTolerance?: number;
  fillBlankAnswers?: string[];
}

export interface IQuiz {
  title: string;
  description?: string;
  instructions?: string;
  courseId?: Types.ObjectId;
  sectionId?: Types.ObjectId;
  lessonId?: Types.ObjectId;
  duration: number; // in minutes (0 = unlimited)
  passingScore: number; // e.g. 50
  passingPercentage: number; // e.g. 60%
  attemptLimit: number; // default 1 (0 = unlimited)
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  negativeMarking: boolean;
  autoSubmit: boolean;
  certificateRequirement: boolean;
  showScoreAfterSubmission: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  allowReview: boolean;
  randomQuestions: boolean;
  questionPool?: number;
  startDate?: Date;
  endDate?: Date;
  availabilityDate?: Date;
  expiryDate?: Date;
  status: QuizStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  questions?: IQuizQuestion[];
  totalQuestions: number;
  totalMarks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizDocument extends IQuiz, Document {}
