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
  let { name, order, educationStage, description, isActive } = req.body;

  // Check duplicate Arabic / English name
  if (name?.ar || name?.en) {
    const nameConditions: any[] = [];
    if (name?.ar) nameConditions.push({ 'name.ar': name.ar });
    if (name?.en) nameConditions.push({ 'name.en': name.en });

    const existingName = await Grade.findOne({ $or: nameConditions });
    if (existingName) {
      if (name?.ar && existingName.name.ar === name.ar) {
        throw new ApiError(400, 'اسم الصف أو المسار باللغة العربية موجود بالفعل');
      }
      if (name?.en && existingName.name.en === name.en) {
        throw new ApiError(400, 'اسم الصف أو المسار باللغة الإنجليزية موجود بالفعل');
      }
    }
  }

  // Auto-resolve order conflict or auto-assign next unique order
  const reqOrder = Number(order);
  const existingOrder = await Grade.findOne({ order: reqOrder });

  if (!reqOrder || isNaN(reqOrder) || existingOrder) {
    const highestGrade = await Grade.findOne().sort({ order: -1 }).select('order').lean();
    order = (highestGrade?.order || 0) + 1;
  } else {
    order = reqOrder;
  }

  const grade = await Grade.create({
    name,
    order,
    educationStage: educationStage || 'Secondary',
    description,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json(new ApiResponse(201, grade, 'تم إضافة المسار أو الصف الدراسي بنجاح'));
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
    throw new ApiError(404, 'الصف أو المسار غير موجود');
  }

  const { name, order, educationStage, description, isActive } = req.body;

  if (name?.ar && name.ar !== grade.name.ar) {
    const dupAr = await Grade.findOne({ 'name.ar': name.ar, _id: { $ne: id } });
    if (dupAr) throw new ApiError(400, 'اسم الصف/المسار باللغة العربية مكرر لصف آخر');
  }

  if (name?.en && name.en !== grade.name.en) {
    const dupEn = await Grade.findOne({ 'name.en': name.en, _id: { $ne: id } });
    if (dupEn) throw new ApiError(400, 'اسم الصف/المسار باللغة الإنجليزية مكرر لصف آخر');
  }

  let finalOrder = grade.order;
  if (order !== undefined && order !== null && Number(order) !== grade.order) {
    const reqOrder = Number(order);
    const dupOrder = await Grade.findOne({ order: reqOrder, _id: { $ne: id } });
    if (dupOrder) {
      const highestGrade = await Grade.findOne().sort({ order: -1 }).select('order').lean();
      finalOrder = (highestGrade?.order || 0) + 1;
    } else {
      finalOrder = reqOrder;
    }
  }

  if (name) grade.name = name;
  grade.order = finalOrder;
  if (educationStage) grade.educationStage = educationStage;
  if (description !== undefined) grade.description = description;
  if (isActive !== undefined) grade.isActive = isActive;

  await grade.save();

  res.status(200).json(new ApiResponse(200, grade, 'تم تحديث الصف/المسار الدراسي بنجاح'));
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
