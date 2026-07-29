import { Document, Types } from 'mongoose';

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending'
  | 'UnderReview'
  | 'Approved'
  | 'Rejected'
  | 'NeedsChanges'
  | 'Suspended';

export interface ISocialLinks {
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
}

export interface ITeacherApplication {
  userId?: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  nationalId?: string;
  subject: string;
  stage: string;
  grades: string[];
  experienceYears: number;
  currentJob?: string;
  bio?: string;
  degree: string;
  university: string;
  graduationYear: number;
  profileImage?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  certificateDoc?: string;
  cvUrl?: string;
  demoVideoUrl?: string;
  socialLinks?: ISocialLinks;
  status: ApplicationStatus;
  isDraft: boolean;
  submittedAt?: Date;
  rejectionReason?: string;
  changesRequested?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacherApplicationDocument extends ITeacherApplication, Document {}
