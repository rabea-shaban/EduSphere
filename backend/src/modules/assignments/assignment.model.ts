import { Schema, model } from 'mongoose';
import { IAssignmentDocument } from './assignment.interface';

const assignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Unit reference is required'],
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson reference is required'],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    instructions: {
      type: String,
      trim: true,
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks are required'],
      min: [0, 'Passing marks cannot be negative'],
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed'],
      default: 'Draft',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSchema.index({ courseId: 1 });
assignmentSchema.index({ unitId: 1 });
assignmentSchema.index({ lessonId: 1 });
assignmentSchema.index({ teacherId: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ deletedAt: 1 });

// Soft Delete Query Middleware
assignmentSchema.pre(/^find|^count/, function (this: any) {
  const options = this.getOptions();
  if (options && options.withDeleted) return;
  this.where({ deletedAt: null });
});

export const Assignment = model<IAssignmentDocument>('Assignment', assignmentSchema);
export default Assignment;
