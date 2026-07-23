import { Schema, model } from 'mongoose';
import { ITransactionDocument } from './transaction.interface';

const transactionSchema = new Schema<ITransactionDocument>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment reference is required'],
    },
    gateway: {
      type: String,
      required: [true, 'Transaction gateway is required'],
      trim: true,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID reference is required'],
      trim: true,
    },
    requestPayload: {
      type: Schema.Types.Mixed,
    },
    responsePayload: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
transactionSchema.index({ paymentId: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ status: 1 });

export const Transaction = model<ITransactionDocument>('Transaction', transactionSchema);
export default Transaction;
