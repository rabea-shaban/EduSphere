import { Document, Types } from 'mongoose';

export interface IMenu {
  title: string;
  url: string;
  parentId?: Types.ObjectId;
  displayOrder: number;
  target: string;
  isActive: boolean;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMenuDocument extends IMenu, Document {}
