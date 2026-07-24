import { Schema, model } from 'mongoose';
import { ICategoryDocument } from './category.interface';

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Blog', 'Course', 'General'],
      required: [true, 'Category type is required'],
      default: 'General',
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ type: 1 });

export const Category = model<ICategoryDocument>('Category', categorySchema);
export default Category;
