import { Request, Response } from 'express';
import { Seo } from './seo.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const createSeo = catchAsync(async (req: Request, res: Response) => {
  const seo = await Seo.create(req.body);
  res.status(201).json(new ApiResponse(201, seo, 'SEO meta config created successfully'));
});

export const getPageSeo = catchAsync(async (req: Request, res: Response) => {
  const { page } = req.query;
  const seo = await Seo.findOne({ page: page as string });
  if (!seo) throw new ApiError(404, 'SEO configurations not found for this page');
  res.status(200).json(new ApiResponse(200, seo, 'SEO configurations retrieved'));
});

export const updateSeo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const seo = await Seo.findByIdAndUpdate(id, req.body, { new: true });
  if (!seo) throw new ApiError(404, 'SEO config not found');
  res.status(200).json(new ApiResponse(200, seo, 'SEO config updated successfully'));
});
