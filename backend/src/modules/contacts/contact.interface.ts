import { Document } from 'mongoose';

export type ContactStatus = 'New' | 'In Progress' | 'Closed';

export interface IContact {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactDocument extends IContact, Document {}
