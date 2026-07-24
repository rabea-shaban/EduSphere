import { Document, Types } from 'mongoose';

export interface ISettings {
  organizationName: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  address?: string;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  organizationId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISettingsDocument extends ISettings, Document {}
