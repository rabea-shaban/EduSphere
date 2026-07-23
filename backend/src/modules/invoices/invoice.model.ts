import { Schema, model } from 'mongoose';
import { IInvoiceDocument } from './invoice.interface';

const invoiceItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      trim: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment reference is required'],
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Issued', 'Paid', 'Cancelled'],
      default: 'Issued',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ studentId: 1 });
invoiceSchema.index({ organizationId: 1 });
invoiceSchema.index({ status: 1 });

export const Invoice = model<IInvoiceDocument>('Invoice', invoiceSchema);
export default Invoice;
