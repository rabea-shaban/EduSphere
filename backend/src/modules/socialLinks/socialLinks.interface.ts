import { Document, Types } from 'mongoose';

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
  tiktok?: string;
  website?: string;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISocialLinksDocument extends ISocialLinks, Document {}
