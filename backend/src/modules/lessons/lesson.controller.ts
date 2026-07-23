import { Request, Response } from 'express';
import slugify from 'slugify';
import { Lesson } from './lesson.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Lesson.
 */
export const createLesson = catchAsync(async (req: Request, res: Response) => {
  const { unitId, order } = req.body;

  // Check if order already exists within the same unit
  const existingOrder = await Lesson.findOne({ unitId, order });
  if (existingOrder) {
    throw new ApiError(400, `Lesson with order ${order} already exists in this unit`);
  }

  const lesson = await Lesson.create(req.body);
  res.status(201).json(new ApiResponse(201, lesson, 'Lesson created successfully'));
});

/**
 * Get all Lessons with pagination, sorting, search, and filters.
 */
export const getAllLessons = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, unitId, courseId, lessonType, isPublished, sort } = req.query;
  const filter: any = {};

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  if (unitId) filter.unitId = unitId;
  if (courseId) filter.courseId = courseId;
  if (lessonType) filter.lessonType = lessonType;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Default sorting by order ascending
  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const lessons = await Lesson.find(filter)
    .populate('unitId', 'title order')
    .populate('courseId', 'title slug')
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await Lesson.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        lessons,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Lessons retrieved successfully'
    )
  );
});

/**
 * Get Lesson by ID.
 */
export const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const lesson = await Lesson.findById(id)
    .populate('unitId', 'title order')
    .populate('courseId', 'title slug');

  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson retrieved successfully'));
});

/**
 * Update Lesson details.
 */
export const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }

  const { title, order, unitId } = req.body;
  const targetUnitId = unitId || lesson.unitId;

  if (order && (order !== lesson.order || unitId)) {
    const existingOrder = await Lesson.findOne({ unitId: targetUnitId, order });
    if (existingOrder && existingOrder._id.toString() !== id) {
      throw new ApiError(400, `Lesson with order ${order} already exists in this unit`);
    }
  }

  if (title && title !== lesson.title) {
    lesson.slug = slugify(title, { lower: true, strict: true });
  }

  Object.assign(lesson, req.body);
  await lesson.save();

  res.status(200).json(new ApiResponse(200, lesson, 'Lesson updated successfully'));
});

/**
 * Delete Lesson.
 */
export const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const lesson = await Lesson.findByIdAndDelete(id);
  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Lesson deleted successfully'));
});
