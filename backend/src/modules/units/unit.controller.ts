import { Request, Response } from 'express';
import { Unit } from './unit.model';
import { Lesson } from '../lessons/lesson.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Unit.
 */
export const createUnit = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.body;
  let { order } = req.body;

  // Auto-compute order if not provided or if there's a collision
  if (!order) {
    const lastUnit = await Unit.findOne({ courseId }).sort({ order: -1 }).select('order');
    order = lastUnit ? (lastUnit.order as number) + 1 : 1;
  } else {
    // Check for order collision and resolve by incrementing
    const existingOrder = await Unit.findOne({ courseId, order });
    if (existingOrder) {
      const lastUnit = await Unit.findOne({ courseId }).sort({ order: -1 }).select('order');
      order = lastUnit ? (lastUnit.order as number) + 1 : order + 1;
    }
  }

  const unit = await Unit.create({ ...req.body, order });
  res.status(201).json(new ApiResponse(201, unit, 'Unit created successfully'));
});

/**
 * Get all Units with query search, pagination, and courseId filters.
 */
export const getAllUnits = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, courseId, isPublished, sort } = req.query;
  const filter: any = {};

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  if (courseId) {
    filter.courseId = courseId;
  }

  if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Default sorting by order ascending
  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const units = await Unit.find(filter)
    .populate('courseId', 'title slug')
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await Unit.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        units,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Units retrieved successfully'
    )
  );
});

/**
 * Get Unit by ID.
 */
export const getUnitById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const unit = await Unit.findById(id).populate('courseId', 'title slug');

  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }

  res.status(200).json(new ApiResponse(200, unit, 'Unit retrieved successfully'));
});

/**
 * Update Unit details.
 */
export const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const unit = await Unit.findById(id);
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }

  const { order, courseId } = req.body;
  const targetCourseId = courseId || unit.courseId;

  if (order && (order !== unit.order || courseId)) {
    const existingOrder = await Unit.findOne({ courseId: targetCourseId, order });
    if (existingOrder && existingOrder._id.toString() !== id) {
      throw new ApiError(400, `Unit with order ${order} already exists in this course`);
    }
  }

  Object.assign(unit, req.body);
  await unit.save();

  res.status(200).json(new ApiResponse(200, unit, 'Unit updated successfully'));
});

/**
 * Delete Unit (cascades to delete all lessons associated with this unit).
 */
export const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const unit = await Unit.findById(id);
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }

  // Cascade delete lessons under this unit
  await Lesson.deleteMany({ unitId: id });
  await unit.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Unit and all its lessons deleted successfully'));
});
