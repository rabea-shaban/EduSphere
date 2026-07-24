import { Document, Types } from 'mongoose';

export type TargetType = 'All Users' | 'Teachers' | 'Students' | 'Parents' | 'Specific Course' | 'Specific Grade';
export type AnnouncementStatus = 'Draft' | 'Published' | 'Archived';

export interface IAnnouncement {
  title: string;
  content: string;
  organizationId?: Types.ObjectId;
  createdBy: Types.ObjectId; // User who created the announcement
  targetType: TargetType;
  targetIds: Types.ObjectId[]; // Can hold Grade IDs, Course IDs, or Specific User IDs
  publishDate: Date;
  expireDate?: Date;
  status: AnnouncementStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncementDocument extends IAnnouncement, Document {}
