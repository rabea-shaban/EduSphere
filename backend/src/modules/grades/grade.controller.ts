import { Request, Response } from 'express';
import { Grade } from './grade.model';
import { Subject } from '../subjects/subject.model';
import { Course } from '../courses/course.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Grade.
 */
export const createGrade = catchAsync(async (req: Request, res: Response) => {
  const { name, order } = req.body;

  // Check unique constraints
  const duplicate = await Grade.findOne({
    $or: [{ 'name.ar': name.ar }, { 'name.en': name.en }, { order }],
  });

  if (duplicate) {
    if (duplicate.name.ar === name.ar) {
      throw new ApiError(400, 'Arabic grade name already exists');
    }
    if (duplicate.name.en === name.en) {
      throw new ApiError(400, 'English grade name already exists');
    }
    if (duplicate.order === order) {
      throw new ApiError(400, 'Grade order already taken');
    }
  }

  const grade = await Grade.create(req.body);
  res.status(201).json(new ApiResponse(201, grade, 'Grade created successfully'));
});

/**
 * Get all Grades with filtering, search, pagination, and sorting.
 */
export const getAllGrades = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 50, search, educationStage, isActive, sort } = req.query;
  const filter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { 'name.ar': searchRegex },
      { 'name.en': searchRegex },
      { description: searchRegex },
    ];
  }

  if (educationStage && educationStage !== 'ALL') {
    filter.educationStage = educationStage;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  let sortBy: any = { order: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const gradesRaw = await Grade.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await Grade.countDocuments(filter);

  // Parallel enrichment of grades with subject & course counts
  const grades = await Promise.all(
    gradesRaw.map(async (g) => {
      const [subjectsCount, coursesCount] = await Promise.all([
        Subject.countDocuments({ grades: g._id }),
        Course.countDocuments({ grade: g._id }),
      ]);
      return {
        ...g,
        subjectsCount,
        coursesCount,
      };
    })
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        grades,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Grades retrieved successfully'
    )
  );
});

/**
 * Get Grade by ID.
 */
export const getGradeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const grade = await Grade.findById(id);

  if (!grade) {
    throw new ApiError(404, 'Grade not found');
  }

  res.status(200).json(new ApiResponse(200, grade, 'Grade retrieved successfully'));
});

/**
 * Update Grade details.
 */
export const updateGrade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await Grade.findById(id);
  if (!grade) {
    throw new ApiError(404, 'Grade not found');
  }

  const { name, order } = req.body;
  const orConditions: any[] = [];
  if (name?.ar && name.ar !== grade.name.ar) {
    orConditions.push({ 'name.ar': name.ar });
  }
  if (name?.en && name.en !== grade.name.en) {
    orConditions.push({ 'name.en': name.en });
  }
  if (order && order !== grade.order) {
    orConditions.push({ order });
  }

  if (orConditions.length > 0) {
    const duplicate = await Grade.findOne({ $or: orConditions });
    if (duplicate) {
      if (name?.ar && duplicate.name.ar === name.ar) {
        throw new ApiError(400, 'Arabic grade name already exists');
      }
      if (name?.en && duplicate.name.en === name.en) {
        throw new ApiError(400, 'English grade name already exists');
      }
      if (order && duplicate.order === order) {
        throw new ApiError(400, 'Grade order already taken');
      }
    }
  }

  Object.assign(grade, req.body);
  await grade.save();

  res.status(200).json(new ApiResponse(200, grade, 'Grade updated successfully'));
});

/**
 * Delete Grade.
 */
export const deleteGrade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await Grade.findByIdAndDelete(id);
  if (!grade) {
    throw new ApiError(404, 'Grade not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Grade deleted successfully'));
});

/**
 * Activate Grade.
 */
export const activateGrade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await Grade.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!grade) {
    throw new ApiError(404, 'Grade not found');
  }

  res.status(200).json(new ApiResponse(200, grade, 'Grade activated successfully'));
});

/**
 * Deactivate Grade.
 */
export const deactivateGrade = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const grade = await Grade.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!grade) {
    throw new ApiError(404, 'Grade not found');
  }

  res.status(200).json(new ApiResponse(200, grade, 'Grade deactivated successfully'));
});
