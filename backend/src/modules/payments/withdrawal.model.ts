import { Schema, model, Document, Types } from 'mongoose';

export type WithdrawalStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Cancelled';
export type WithdrawalMethod = 'Vodafone Cash' | 'InstaPay' | 'Bank Transfer' | 'Fawry';

export interface IWithdrawal {
  teacherId: Types.ObjectId;
  amount: number;
  method: WithdrawalMethod;
  accountDetails: string;
  status: WithdrawalStatus;
  requestedAt: Date;
  processedAt?: Date;
  reviewedBy?: Types.ObjectId;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWithdrawalDocument extends IWithdrawal, Document {}

const withdrawalSchema = new Schema<IWithdrawalDocument>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
      min: [1, 'Amount must be greater than zero'],
    },
    method: {
      type: String,
      enum: ['Vodafone Cash', 'InstaPay', 'Bank Transfer', 'Fawry'],
      default: 'Vodafone Cash',
    },
    accountDetails: {
      type: String,
      required: [true, 'Account details / phone number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Paid', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

withdrawalSchema.index({ teacherId: 1 });
withdrawalSchema.index({ status: 1 });

export const Withdrawal = model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
export default Withdrawal;
