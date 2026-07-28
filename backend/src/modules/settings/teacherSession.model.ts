import { Schema, model } from 'mongoose';
import { ITeacherSessionDocument } from './teacherSettings.interface';

const teacherSessionSchema = new Schema<ITeacherSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    token: {
      type: String,
      select: false,
    },
    deviceName: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      default: 'Unknown Device',
    },
    ipAddress: {
      type: String,
      required: [true, 'IP Address is required'],
      trim: true,
      default: '127.0.0.1',
    },
    location: {
      type: String,
      default: 'القاهرة، مصر',
      trim: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

teacherSessionSchema.index({ userId: 1, lastActive: -1 });

export const TeacherSession = model<ITeacherSessionDocument>('TeacherSession', teacherSessionSchema);
export default TeacherSession;
