import { Schema, model } from 'mongoose';
import { IAssignmentDocument } from './assignment.interface';

const assignmentAttachmentSchema = new Schema(
  {
    name: { type: String, trim: true },
    url: { type: String, required: true, trim: true },
    fileType: { type: String, trim: true },
    fileSize: { type: Number, default: 0 },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [3000, 'Instructions cannot exceed 3000 characters'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
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
      required: [true, 'Lesson reference is required'],
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
      index: true,
    },
    attachments: [assignmentAttachmentSchema],
    totalMarks: {
      type: Number,
      required: [true, 'Total marks are required'],
      default: 100,
      min: [0, 'Marks cannot be negative'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks are required'],
      default: 60,
      min: [0, 'Passing marks cannot be negative'],
    },
    submissionType: {
      type: String,
      enum: [
        'TextSubmission',
        'FileUpload',
        'PDFUpload',
        'ImageUpload',
        'ZIPUpload',
        'ExternalUrl',
        'MultipleAttachments',
      ],
      default: 'FileUpload',
    },
    allowedFileTypes: [
      {
        type: String,
        trim: true,
      },
    ],
    maxFileSizeMB: {
      type: Number,
      default: 10,
      min: 1,
    },
    maxFiles: {
      type: Number,
      default: 5,
      min: 1,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 0, // 0 = unlimited
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    latePenaltyPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    expiryDate: {
      type: Date,
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Enrolled'],
      default: 'Enrolled',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed', 'Archived'],
      default: 'Draft',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    estimatedDuration: {
      type: Number,
      default: 60, // in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSchema.index({ courseId: 1, status: 1 });
assignmentSchema.index({ courseId: 1, isDeleted: 1 });
assignmentSchema.index({ deletedAt: 1 });

// Soft Delete Query Middleware
assignmentSchema.pre(/^find|^count/, function (this: any) {
  const options = this.getOptions();
  if (options && options.withDeleted) return;
  this.where({ isDeleted: { $ne: true } });
});

export const Assignment = model<IAssignmentDocument>('Assignment', assignmentSchema);
export default Assignment;
