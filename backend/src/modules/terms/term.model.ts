import { Schema, model } from 'mongoose';
import { ITermDocument } from './term.interface';

const termSchema = new Schema<ITermDocument>(
  {
    name: {
      type: String,
      enum: ['First Term', 'Second Term'],
      required: [true, 'Term name is required'],
      unique: true,
    },
    order: {
      type: Number,
      required: [true, 'Term order is required'],
      unique: true,
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
termSchema.index({ name: 1 }, { unique: true });
termSchema.index({ order: 1 }, { unique: true });
termSchema.index({ isActive: 1 });

export const Term = model<ITermDocument>('Term', termSchema);
export default Term;
