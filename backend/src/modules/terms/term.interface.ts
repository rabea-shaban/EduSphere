import { Document } from 'mongoose';

export type TermName = 'First Term' | 'Second Term';

export interface ITerm {
  name: TermName;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITermDocument extends ITerm, Document {}
