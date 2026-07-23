import { Schema, model } from 'mongoose';
import { ISubmissionDocument } from './submission.interface';

const submissionSchema = new Schema<ISubmissionDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    textAnswer: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Late', 'Reviewed'],
      default: 'Submitted',
    },
    grade: {
      type: Number,
      min: [0, 'Grade cannot be negative'],
    },
    feedback: {
      type: String,
      trim: true,
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
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1 });
submissionSchema.index({ studentId: 1 });
submissionSchema.index({ status: 1 });

export const Submission = model<ISubmissionDocument>('Submission', submissionSchema);
export default Submission;
