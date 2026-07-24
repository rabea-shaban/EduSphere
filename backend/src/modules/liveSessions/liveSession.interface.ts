import { Document, Types } from 'mongoose';

export type MeetingProvider = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Custom';
export type LiveSessionStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';

export interface ILiveSession {
  title: string;
  description?: string;
  organizationId?: Types.ObjectId;
  courseId: Types.ObjectId;
  teacherId: Types.ObjectId;
  provider: MeetingProvider;
  meetingUrl: string;
  meetingId?: string;
  meetingPassword?: string;
  startTime: Date;
  endTime: Date;
  status: LiveSessionStatus;
  recordingUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILiveSessionDocument extends ILiveSession, Document {}
