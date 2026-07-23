import { Request, Response } from 'express';
import slugify from 'slugify';
import { Subject } from './subject.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new Subject.
 */
export const createSubject = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;

  const existingSubject = await Subject.findOne({ name });
  if (existingSubject) {
    throw new ApiError(400, 'Subject with this name already exists');
  }

  const subject = await Subject.create(req.body);
  res.status(201).json(new ApiResponse(201, subject, 'Subject created successfully'));
});

/**
 * Get all Subjects with search, filtering, pagination, sorting, and population.
 */
export const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, educationStage, isActive, sort, gradeId, teacherId } = req.query;
  const filter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { name: searchRegex },
      { slug: searchRegex },
      { description: searchRegex },
    ];
  }

  if (educationStage) {
    filter.educationStage = educationStage;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (gradeId) {
    filter.grades = gradeId;
  }

  if (teacherId) {
    filter.teacherIds = teacherId;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortBy: any = { name: 1 };
  if (sort) {
    const sortParts = (sort as string).split(':');
    sortBy = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
  }

  const subjects = await Subject.find(filter)
    .populate('grades')
    .populate('teacherIds', '-password') // Exclude teacher password
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  const total = await Subject.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        subjects,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Subjects retrieved successfully'
    )
  );
});

/**
 * Get Subject by ID.
 */
export const getSubjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await Subject.findById(id)
    .populate('grades')
    .populate('teacherIds', '-password');

  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  res.status(200).json(new ApiResponse(200, subject, 'Subject retrieved successfully'));
});

/**
 * Update Subject details.
 */
export const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await Subject.findById(id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  const { name } = req.body;
  if (name && name !== subject.name) {
    const duplicate = await Subject.findOne({ name });
    if (duplicate) {
      throw new ApiError(400, 'Subject with this name already exists');
    }
    // Update slug as well
    subject.slug = slugify(name, { lower: true, strict: true });
  }

  Object.assign(subject, req.body);
  await subject.save();

  res.status(200).json(new ApiResponse(200, subject, 'Subject updated successfully'));
});

/**
 * Delete Subject.
 */
export const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Subject deleted successfully'));
});

/**
 * Activate Subject.
 */
export const activateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await Subject.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  res.status(200).json(new ApiResponse(200, subject, 'Subject activated successfully'));
});

/**
 * Deactivate Subject.
 */
export const deactivateSubject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  res.status(200).json(new ApiResponse(200, subject, 'Subject deactivated successfully'));
});
