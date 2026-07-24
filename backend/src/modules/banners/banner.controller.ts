import { Request, Response } from 'express';
import { Banner } from './banner.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(new ApiResponse(201, banner, 'Banner created successfully'));
});

export const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const banners = await Banner.find(filter).skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: -1 });
  const total = await Banner.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { banners, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Banners retrieved successfully'));
});

export const getBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.status(200).json(new ApiResponse(200, banner, 'Banner retrieved successfully'));
});

export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.status(200).json(new ApiResponse(200, banner, 'Banner updated successfully'));
});

export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.status(200).json(new ApiResponse(200, null, 'Banner deleted successfully'));
});
