import { Document, Types } from 'mongoose';

export type TargetAudience = 'All' | 'Grade' | 'Course' | 'Specific Students';

export interface IAnnouncement {
  title: string;
  content: string;
  organizationId?: Types.ObjectId;
  teacherId: Types.ObjectId;
  targetAudience: TargetAudience;
  targetIds: Types.ObjectId[]; // Can hold Grade IDs, Course IDs, or User/Student IDs
  publishAt: Date;
  expireAt?: Date;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncementDocument extends IAnnouncement, Document {}
