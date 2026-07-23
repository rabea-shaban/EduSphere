import { Schema, model } from 'mongoose';
import { IAnnouncementDocument } from './announcement.interface';

const announcementSchema = new Schema<IAnnouncementDocument>(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Grade', 'Course', 'Specific Students'],
      required: [true, 'Target audience classification is required'],
    },
    targetIds: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    publishAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
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
announcementSchema.index({ teacherId: 1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ isPublished: 1 });
announcementSchema.index({ publishAt: -1 });

export const Announcement = model<IAnnouncementDocument>('Announcement', announcementSchema);
export default Announcement;
