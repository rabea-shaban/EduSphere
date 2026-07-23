import { Document, Types } from 'mongoose';

export interface IProgress {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  lessonId: Types.ObjectId;
  videoProgress: number; // Percentage, e.g. 0 to 100
  watchTime: number; // in seconds
  completed: boolean;
  completedAt?: Date;
  lastPosition: number; // playback position in seconds
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProgressDocument extends IProgress, Document {}
