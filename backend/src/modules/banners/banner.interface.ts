import { Document, Types } from 'mongoose';

export interface IBanner {
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  displayOrder: number;
  isActive: boolean;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBannerDocument extends IBanner, Document {}
