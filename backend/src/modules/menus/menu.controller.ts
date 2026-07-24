import { Request, Response } from 'express';
import { Menu } from './menu.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const createMenu = catchAsync(async (req: Request, res: Response) => {
  const menu = await Menu.create(req.body);
  res.status(201).json(new ApiResponse(201, menu, 'Menu item created successfully'));
});

export const getAllMenus = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 100, isActive } = req.query;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const menus = await Menu.find(filter).populate('parentId', 'title').skip(skip).limit(limitNum).sort({ displayOrder: 1, createdAt: 1 });
  const total = await Menu.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { menus, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Menus retrieved successfully'));
});

export const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const menu = await Menu.findByIdAndUpdate(id, req.body, { new: true });
  if (!menu) throw new ApiError(404, 'Menu item not found');
  res.status(200).json(new ApiResponse(200, menu, 'Menu item updated successfully'));
});

export const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const menu = await Menu.findByIdAndDelete(id);
  if (!menu) throw new ApiError(404, 'Menu item not found');
  res.status(200).json(new ApiResponse(200, null, 'Menu item deleted successfully'));
});
