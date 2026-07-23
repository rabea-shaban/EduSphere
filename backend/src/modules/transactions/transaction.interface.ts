import { Document, Types } from 'mongoose';

export interface ITransaction {
  paymentId: Types.ObjectId;
  gateway: string; // Stripe, Cash, Bank Transfer, etc.
  transactionId: string; // reference string
  requestPayload?: any;
  responsePayload?: any;
  status: 'Pending' | 'Success' | 'Failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}
