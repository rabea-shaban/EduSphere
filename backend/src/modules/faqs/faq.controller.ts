import { Request, Response } from 'express';
import { Faq } from './faq.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const createFaq = catchAsync(async (req: Request, res: Response) => {
  const faq = await Faq.create(req.body);
  res.status(201).json(new ApiResponse(201, faq, 'FAQ created successfully'));
});

export const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const faqs = await Faq.find(filter).skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: -1 });
  const total = await Faq.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { faqs, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'FAQs retrieved successfully'));
});

export const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const faq = await Faq.findById(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.status(200).json(new ApiResponse(200, faq, 'FAQ retrieved successfully'));
});

export const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.status(200).json(new ApiResponse(200, faq, 'FAQ updated successfully'));
});

export const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.status(200).json(new ApiResponse(200, null, 'FAQ deleted successfully'));
});
