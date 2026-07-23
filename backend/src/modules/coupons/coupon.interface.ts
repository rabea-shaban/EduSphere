import { Document } from 'mongoose';

export type DiscountType = 'Percentage' | 'Fixed';
export type CouponStatus = 'Active' | 'Inactive';

export interface ICoupon {
  code: string; // Unique, uppercase
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maximumDiscount?: number; // max discount amount for Percentage type
  minimumPurchase: number; // min purchase amount required
  usageLimit?: number; // max total times this coupon can be used
  usedCount: number; // current usage count
  expiresAt: Date;
  status: CouponStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICouponDocument extends ICoupon, Document {}
