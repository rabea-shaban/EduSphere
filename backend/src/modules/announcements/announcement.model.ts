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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    targetType: {
      type: String,
      enum: ['All Users', 'Teachers', 'Students', 'Parents', 'Specific Course', 'Specific Grade'],
      required: [true, 'Target type classification is required'],
    },
    targetIds: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expireDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
announcementSchema.index({ createdBy: 1 });
announcementSchema.index({ targetType: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ publishDate: -1 });

export const Announcement = model<IAnnouncementDocument>('Announcement', announcementSchema);
export default Announcement;
