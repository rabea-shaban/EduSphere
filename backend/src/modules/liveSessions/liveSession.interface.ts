import { Document, Types } from 'mongoose';

export type MeetingProvider = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Custom';
export type LiveSessionStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';

export interface ILiveSession {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  teacherId: Types.ObjectId;
  meetingProvider: MeetingProvider;
  meetingLink: string;
  meetingId?: string;
  startTime: Date;
  endTime: Date;
  status: LiveSessionStatus;
  recordingUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILiveSessionDocument extends ILiveSession, Document {}
