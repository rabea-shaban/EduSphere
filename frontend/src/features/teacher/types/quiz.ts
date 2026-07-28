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
  | 'MCQ';

export interface ApiOption {
  _id?: string;
  id?: string;
  text: string;
  isCorrect?: boolean;
  order?: number;
  matchingPair?: string;
}

export interface ApiQuestion {
  _id?: string;
  id?: string;
  question: string;
  instructions?: string;
  type: QuestionType;
  marks: number;
  explanation?: string;
  order: number;
  options?: ApiOption[];
  correctAnswer?: any;
  numericAnswer?: number;
  numericTolerance?: number;
  fillBlankAnswers?: string[];
}

export interface ApiQuiz {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  courseId?: string | { _id: string; title: string; slug: string };
  sectionId?: string | { _id: string; title: string; order: number };
  lessonId?: string | { _id: string; title: string };
  duration: number; // minutes
  passingScore: number;
  passingPercentage: number;
  attemptLimit: number;
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
  startDate?: string;
  endDate?: string;
  availabilityDate?: string;
  expiryDate?: string;
  status: QuizStatus;
  isDeleted: boolean;
  deletedAt?: string;
  questions?: ApiQuestion[];
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizInput {
  title: string;
  description?: string;
  instructions?: string;
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
  duration?: number;
  passingScore?: number;
  passingPercentage?: number;
  attemptLimit?: number;
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  negativeMarking?: boolean;
  autoSubmit?: boolean;
  certificateRequirement?: boolean;
  showScoreAfterSubmission?: boolean;
  showCorrectAnswers?: boolean;
  showExplanations?: boolean;
  allowReview?: boolean;
  randomQuestions?: boolean;
  questionPool?: number;
  startDate?: string;
  endDate?: string;
  availabilityDate?: string;
  expiryDate?: string;
  status?: QuizStatus;
  questions?: ApiQuestion[];
}

export interface UpdateQuizInput extends Partial<CreateQuizInput> {}

export interface CreateQuestionInput {
  question: string;
  instructions?: string;
  type?: QuestionType;
  marks?: number;
  explanation?: string;
  order?: number;
  options?: ApiOption[];
  correctAnswer?: any;
  numericAnswer?: number;
  numericTolerance?: number;
  fillBlankAnswers?: string[];
}

export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {}

export interface ReorderQuestionItem {
  id: string;
  order: number;
}

export interface QuizAnalytics {
  quizId: string;
  quizTitle: string;
  totalQuestions: number;
  totalMarks: number;
  attemptsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  passRate: number;
  failureRate: number;
  completionRate: number;
  averageCompletionTimeSeconds: number;
}

export interface QuizFilters {
  search?: string;
  status?: QuizStatus | 'ALL' | '';
  courseId?: string;
  sectionId?: string;
  lessonId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
