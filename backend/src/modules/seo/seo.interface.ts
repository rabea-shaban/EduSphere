import { Document, Types } from 'mongoose';

export interface ISeo {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISeoDocument extends ISeo, Document {}
