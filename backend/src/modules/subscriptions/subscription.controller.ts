import { Request, Response } from 'express';
import { SubscriptionPlan } from './subscription.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new subscription plan.
 */
export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json(new ApiResponse(201, plan, 'Subscription plan created successfully'));
});

/**
 * Get all subscription plans with pagination, sorting and filtering.
 */
export const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const filter: any = {};

  if (search) {
    filter.name = new RegExp(search as string, 'i');
  }
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const plans = await SubscriptionPlan.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await SubscriptionPlan.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        plans,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Subscription plans retrieved successfully'
    )
  );
});

/**
 * Get Subscription Plan by ID.
 */
export const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findById(id);

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan retrieved successfully'));
});

/**
 * Update Subscription Plan.
 */
export const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan updated successfully'));
});

/**
 * Activate a subscription plan.
 */
export const activatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { status: 'Active' }, { new: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan activated successfully'));
});

/**
 * Deactivate a subscription plan.
 */
export const deactivatePlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });

  if (!plan) {
    throw new ApiError(404, 'Subscription plan not found');
  }

  res.status(200).json(new ApiResponse(200, plan, 'Subscription plan deactivated successfully'));
});
export default createPlan;
