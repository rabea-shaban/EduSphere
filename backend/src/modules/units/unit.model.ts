import { Schema, model } from 'mongoose';
import { IUnitDocument } from './unit.interface';

const unitSchema = new Schema<IUnitDocument>(
  {
    title: {
      type: String,
      required: [true, 'Unit title is required'],
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
    order: {
      type: Number,
      required: [true, 'Unit order is required'],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
unitSchema.index({ courseId: 1 });
unitSchema.index({ order: 1 });
unitSchema.index({ courseId: 1, order: 1 });

export const Unit = model<IUnitDocument>('Unit', unitSchema);
export default Unit;
