import { Document, Types } from 'mongoose';

export type InvoiceStatus = 'Issued' | 'Paid' | 'Cancelled';

export interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IInvoice {
  invoiceNumber: string; // Unique reference
  studentId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  paymentId: Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvoiceDocument extends IInvoice, Document {}
