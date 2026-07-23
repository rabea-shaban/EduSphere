import { Request, Response } from 'express';
import { Invoice } from './invoice.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Generate a new invoice manually (Admins only).
 */
export const createInvoice = catchAsync(async (req: Request, res: Response) => {
  const invoice = await Invoice.create(req.body);
  res.status(201).json(new ApiResponse(201, invoice, 'Invoice generated successfully'));
});

/**
 * Retrieve paginated invoice records with filters.
 */
export const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, studentId } = req.query;
  const filter: any = {};

  if (status) filter.status = status;

  // Enforce student view restrictions
  if (req.user && req.user.role === 'STUDENT') {
    filter.studentId = req.user._id;
  } else if (studentId) {
    filter.studentId = studentId;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const invoices = await Invoice.find(filter)
    .populate('studentId', 'firstName lastName email')
    .populate('paymentId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Invoice.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        invoices,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Invoices retrieved successfully'
    )
  );
});

/**
 * Get single Invoice details.
 */
export const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id)
    .populate('studentId', 'firstName lastName email')
    .populate('paymentId');

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  res.status(200).json(new ApiResponse(200, invoice, 'Invoice retrieved successfully'));
});
export default createInvoice;
