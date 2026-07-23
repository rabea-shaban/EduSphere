import { Schema, model } from 'mongoose';
import { IResourceDocument } from './resource.interface';

const resourceSchema = new Schema<IResourceDocument>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson reference is required'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['PDF', 'Image', 'ZIP', 'Code', 'Document', 'External Link'],
      required: [true, 'Resource type is required'],
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
    },
    publicId: {
      type: String,
    },
    size: {
      type: Number,
      default: 0, // in bytes
    },
    extension: {
      type: String,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resourceSchema.index({ lessonId: 1 });
resourceSchema.index({ courseId: 1 });

export const Resource = model<IResourceDocument>('Resource', resourceSchema);
export default Resource;
