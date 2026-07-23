import { Schema, model } from 'mongoose';
import { IProgressDocument } from './progress.interface';

const progressSchema = new Schema<IProgressDocument>(
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
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson reference is required'],
    },
    videoProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    watchTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    lastPosition: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
progressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ studentId: 1, courseId: 1 });
progressSchema.index({ studentId: 1 });
progressSchema.index({ courseId: 1 });
progressSchema.index({ lessonId: 1 });

export const Progress = model<IProgressDocument>('Progress', progressSchema);
export default Progress;
