import { Schema, model } from 'mongoose';
import { ILiveSessionDocument } from './liveSession.interface';

const liveSessionSchema = new Schema<ILiveSessionDocument>(
  {
    title: {
      type: String,
      required: [true, 'Live Session title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    provider: {
      type: String,
      enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'Custom'],
      required: [true, 'Meeting provider is required'],
    },
    meetingUrl: {
      type: String,
      required: [true, 'Meeting URL is required'],
      trim: true,
    },
    meetingId: {
      type: String,
      trim: true,
    },
    meetingPassword: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Live', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    recordingUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
liveSessionSchema.index({ courseId: 1 });
liveSessionSchema.index({ teacherId: 1 });
liveSessionSchema.index({ status: 1 });
liveSessionSchema.index({ startTime: 1 });

export const LiveSession = model<ILiveSessionDocument>('LiveSession', liveSessionSchema);
export default LiveSession;
