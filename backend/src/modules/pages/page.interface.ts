import { Document, Types } from 'mongoose';

export type PageType = 'Home' | 'About' | 'Contact' | 'Privacy Policy' | 'Terms' | 'Custom';
export type PageStatus = 'Draft' | 'Published';

export interface IPage {
  title: string;
  slug: string;
  content: string;
  pageType: PageType;
  status: PageStatus;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPageDocument extends IPage, Document {}
