import { Schema, model } from 'mongoose';
import { ISubmissionDocument } from './submission.interface';

const submissionSchema = new Schema<ISubmissionDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    attachments: [Schema.Types.Mixed],
    textAnswer: {
      type: String,
      trim: true,
    },
    externalUrl: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Late', 'Reviewed', 'Graded', 'Returned'],
      default: 'Submitted',
      index: true,
    },
    grade: {
      type: Number,
      min: [0, 'Grade cannot be negative'],
    },
    feedback: {
      type: String,
      trim: true,
    },
    privateNotes: {
      type: String,
      trim: true,
    },
    publicFeedback: {
      type: String,
      trim: true,
    },
    gradeOverride: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
submissionSchema.index({ assignmentId: 1, studentId: 1, attemptNumber: 1 });
submissionSchema.index({ assignmentId: 1, status: 1 });
submissionSchema.index({ studentId: 1 });

export const Submission = model<ISubmissionDocument>('Submission', submissionSchema);
export default Submission;
