import { Schema, model } from 'mongoose';
import { IVideoDocument } from './video.interface';

const videoSchema = new Schema<IVideoDocument>(
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
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: ['Cloudinary'],
      default: 'Cloudinary',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    publicId: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    quality: {
      type: String,
      enum: ['360', '480', '720', '1080'],
      default: '720',
    },
    captions: [
      {
        language: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
videoSchema.index({ lessonId: 1 });
videoSchema.index({ courseId: 1 });
videoSchema.index({ isPublished: 1 });

export const Video = model<IVideoDocument>('Video', videoSchema);
export default Video;
