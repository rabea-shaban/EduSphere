import { Request, Response } from 'express';
import { Transaction } from './transaction.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Retrieve transaction audit logs (Admins only).
 */
export const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, gateway } = req.query;
  const filter: any = {};

  if (status) filter.status = status;
  if (gateway) filter.gateway = gateway;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const transactions = await Transaction.find(filter)
    .populate('paymentId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Transaction.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Transaction audit logs retrieved successfully'
    )
  );
});

/**
 * Get single transaction details.
 */
export const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id).populate('paymentId');

  if (!transaction) {
    throw new ApiError(404, 'Transaction log not found');
  }

  res.status(200).json(new ApiResponse(200, transaction, 'Transaction logs retrieved successfully'));
});
export default getAllTransactions;
