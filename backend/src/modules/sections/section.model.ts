import { Schema, model } from 'mongoose';
import { ISectionDocument } from './section.interface';

const sectionSchema = new Schema<ISectionDocument>(
  {
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
      maxlength: [200, 'Section title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Section description cannot exceed 2000 characters'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    order: {
      type: Number,
      required: [true, 'Section order is required'],
      min: [1, 'Order must be at least 1'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Hidden', 'Archived'],
      default: 'Draft',
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Enrolled'],
      default: 'Enrolled',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
      default: 0, // in minutes
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    completionRule: {
      type: String,
      enum: ['AllLessons', 'MinimumLessons', 'AnyLesson'],
      default: 'AllLessons',
    },
    minimumLessonsRequired: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performance
sectionSchema.index({ courseId: 1, order: 1 });
sectionSchema.index({ courseId: 1, status: 1 });
sectionSchema.index({ courseId: 1, isDeleted: 1 });
sectionSchema.index({ courseId: 1, order: 1, isDeleted: 1 });

// Default filter: exclude soft-deleted records
sectionSchema.pre(/^find/, function (this: any) {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: false });
  }
});

export const Section = model<ISectionDocument>('Section', sectionSchema);
export default Section;
