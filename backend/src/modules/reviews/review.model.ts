import { Schema, model, Document, Types } from 'mongoose';

export type ReviewSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type ReviewStatus = 'APPROVED' | 'PENDING_MODERATION' | 'REJECTED' | 'FLAGGED';

export interface ITeacherReply {
  replyText: string;
  repliedAt: Date;
  updatedAt?: Date;
}

export interface IReview {
  courseId: Types.ObjectId;
  studentId: Types.ObjectId;
  rating: number; // 1 - 5
  title?: string;
  comment: string;
  sentiment: ReviewSentiment;
  keywords: string[];
  teacherReply?: ITeacherReply;
  helpfulVotes: {
    count: number;
    userIds: Types.ObjectId[];
  };
  status: ReviewStatus;
  isFlagged: boolean;
  flaggedReason?: string;
  flaggedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    title: {
      type: String,
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minLength: [5, 'Comment must be at least 5 characters long'],
      maxLength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
      default: 'POSITIVE',
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    teacherReply: {
      replyText: {
        type: String,
        trim: true,
        maxLength: [1500, 'Reply text cannot exceed 1500 characters'],
      },
      repliedAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    },
    helpfulVotes: {
      count: {
        type: Number,
        default: 0,
      },
      userIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING_MODERATION', 'REJECTED', 'FLAGGED'],
      default: 'APPROVED',
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedReason: {
      type: String,
      trim: true,
    },
    flaggedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ courseId: 1, studentId: 1 }, { unique: true });
reviewSchema.index({ courseId: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ sentiment: 1 });
reviewSchema.index({ status: 1 });

export const Review = model<IReviewDocument>('Review', reviewSchema);
export default Review;
