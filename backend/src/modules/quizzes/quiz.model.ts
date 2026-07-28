import { Schema, model } from 'mongoose';
import { IQuizDocument } from './quiz.interface';

const answerOptionSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, default: false },
    order: { type: Number, default: 1 },
    matchingPair: { type: String, trim: true },
  },
  { _id: true }
);

const quizQuestionSchema = new Schema(
  {
    question: { type: String, required: [true, 'Question text is required'], trim: true },
    instructions: { type: String, trim: true },
    type: {
      type: String,
      enum: [
        'SingleChoice',
        'MultipleChoice',
        'TrueFalse',
        'ShortAnswer',
        'Essay',
        'FillBlank',
        'Matching',
        'Ordering',
        'Numeric',
        'FileUpload',
        'MCQ',
      ],
      default: 'SingleChoice',
    },
    marks: { type: Number, default: 1, min: 0 },
    explanation: { type: String, trim: true },
    order: { type: Number, default: 1 },
    options: [answerOptionSchema],
    correctAnswer: { type: Schema.Types.Mixed },
    numericAnswer: { type: Number },
    numericTolerance: { type: Number, default: 0 },
    fillBlankAnswers: [{ type: String }],
  },
  { _id: true }
);

const quizSchema = new Schema<IQuizDocument>(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [200, 'Quiz title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      index: true,
    },
    duration: {
      type: Number,
      default: 0, // in minutes (0 = unlimited)
      min: 0,
    },
    passingScore: {
      type: Number,
      default: 50,
      min: 0,
    },
    passingPercentage: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },
    attemptLimit: {
      type: Number,
      default: 1,
      min: 0, // 0 = unlimited
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
    autoSubmit: {
      type: Boolean,
      default: true,
    },
    certificateRequirement: {
      type: Boolean,
      default: false,
    },
    showScoreAfterSubmission: {
      type: Boolean,
      default: true,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
    showExplanations: {
      type: Boolean,
      default: true,
    },
    allowReview: {
      type: Boolean,
      default: true,
    },
    randomQuestions: {
      type: Boolean,
      default: false,
    },
    questionPool: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    availabilityDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Published',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    questions: [quizQuestionSchema],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizSchema.index({ courseId: 1, status: 1 });
quizSchema.index({ courseId: 1, isDeleted: 1 });

// Soft-delete pre-find hook
quizSchema.pre(/^find/, function (this: any) {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: false });
  }
});

// Pre-save hook to calculate totalQuestions & totalMarks
quizSchema.pre('save', function (this: IQuizDocument) {
  if (this.questions && Array.isArray(this.questions)) {
    this.totalQuestions = this.questions.length;
    this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  } else {
    this.totalQuestions = 0;
    this.totalMarks = 0;
  }
});

export const Quiz = model<IQuizDocument>('Quiz', quizSchema);
export default Quiz;
