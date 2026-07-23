import { Schema, model } from 'mongoose';
import { IEnrollmentDocument } from './enrollment.interface';

const enrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Free'],
      default: 'Unpaid',
    },
    purchasePrice: {
      type: Number,
      default: 0,
      min: [0, 'Purchase price cannot be negative'],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ teacherId: 1 });
enrollmentSchema.index({ status: 1 });

export const Enrollment = model<IEnrollmentDocument>('Enrollment', enrollmentSchema);
export default Enrollment;
