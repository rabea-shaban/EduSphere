import { Request, Response } from 'express';
import { Coupon } from './coupon.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new coupon.
 */
export const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
});

/**
 * Get all coupons with filters and pagination.
 */
export const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const filter: any = {};

  if (search) {
    filter.code = new RegExp(search as string, 'i');
  }
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const coupons = await Coupon.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Coupon.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        coupons,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Coupons retrieved successfully'
    )
  );
});

/**
 * Get Coupon by ID.
 */
export const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.status(200).json(new ApiResponse(200, coupon, 'Coupon retrieved successfully'));
});

/**
 * Update Coupon.
 */
export const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.status(200).json(new ApiResponse(200, coupon, 'Coupon updated successfully'));
});

/**
 * Delete Coupon.
 */
export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Coupon deleted successfully'));
});

/**
 * Validate and apply coupon against a purchase price.
 */
export const validateAndApplyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, purchaseAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    throw new ApiError(404, 'Invalid coupon code');
  }

  if (coupon.status !== 'Active') {
    throw new ApiError(400, 'Coupon is inactive');
  }

  if (new Date() > new Date(coupon.expiresAt)) {
    throw new ApiError(400, 'Coupon has expired');
  }

  if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit has been reached');
  }

  if (purchaseAmount < coupon.minimumPurchase) {
    throw new ApiError(400, `Minimum purchase amount of $${coupon.minimumPurchase} is required to use this coupon`);
  }

  // Calculate discount value
  let discount = 0;
  if (coupon.discountType === 'Fixed') {
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'Percentage') {
    discount = (coupon.discountValue / 100) * purchaseAmount;
    if (coupon.maximumDiscount !== undefined && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  }

  // Ensure discount does not exceed the total price
  discount = Math.min(discount, purchaseAmount);
  const finalAmount = purchaseAmount - discount;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon,
        discount,
        finalAmount,
      },
      'Coupon validated successfully'
    )
  );
});
export default createCoupon;
