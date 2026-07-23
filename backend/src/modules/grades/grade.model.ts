import { Schema, model } from 'mongoose';
import { IGradeDocument } from './grade.interface';

const gradeSchema = new Schema<IGradeDocument>(
  {
    name: {
      ar: {
        type: String,
        required: [true, 'Arabic grade name is required'],
        unique: true,
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English grade name is required'],
        unique: true,
        trim: true,
      },
    },
    order: {
      type: Number,
      required: [true, 'Grade ordering is required'],
      unique: true,
    },
    educationStage: {
      type: String,
      enum: ['Primary', 'Preparatory', 'Secondary'],
      required: [true, 'Education stage is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
gradeSchema.index({ 'name.ar': 1 }, { unique: true });
gradeSchema.index({ 'name.en': 1 }, { unique: true });
gradeSchema.index({ order: 1 }, { unique: true });
gradeSchema.index({ educationStage: 1 });
gradeSchema.index({ isActive: 1 });

export const Grade = model<IGradeDocument>('Grade', gradeSchema);
export default Grade;
