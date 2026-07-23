import { Request, Response } from 'express';
import { Assignment } from './assignment.model';
import { Submission } from '../submissions/submission.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new assignment.
 */
export const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const assignmentData = { ...req.body };
  if (!assignmentData.teacherId && req.user) {
    assignmentData.teacherId = req.user._id;
  }

  const assignment = await Assignment.create(assignmentData);
  res.status(201).json(new ApiResponse(201, assignment, 'Assignment created successfully'));
});

/**
 * Get all assignments with search, pagination, and filters.
 */
export const getAllAssignments = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, courseId, unitId, lessonId, status } = req.query;
  const filter: any = { deletedAt: null };

  if (search) {
    filter.title = new RegExp(search as string, 'i');
  }

  if (courseId) filter.courseId = courseId;
  if (unitId) filter.unitId = unitId;
  if (lessonId) filter.lessonId = lessonId;
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const assignments = await Assignment.find(filter)
    .populate('courseId', 'title slug')
    .populate('unitId', 'title')
    .populate('lessonId', 'title')
    .populate('teacherId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Assignment.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        assignments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Assignments retrieved successfully'
    )
  );
});

/**
 * Get Assignment by ID.
 */
export const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id)
    .populate('courseId', 'title slug')
    .populate('unitId', 'title')
    .populate('lessonId', 'title')
    .populate('teacherId', 'firstName lastName email');

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment retrieved successfully'));
});

/**
 * Update Assignment.
 */
export const updateAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  // Ownership validation for teachers
  if (req.user && req.user.role === 'TEACHER' && assignment.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this assignment');
  }

  Object.assign(assignment, req.body);
  await assignment.save();

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment updated successfully'));
});

/**
 * Soft delete an assignment.
 */
export const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  // Ownership validation for teachers
  if (req.user && req.user.role === 'TEACHER' && assignment.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to delete this assignment');
  }

  assignment.deletedAt = new Date();
  await assignment.save();

  res.status(200).json(new ApiResponse(200, null, 'Assignment soft-deleted successfully'));
});

/**
 * Publish Assignment.
 */
export const publishAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = await Assignment.findByIdAndUpdate(id, { status: 'Published' }, { new: true });

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment published successfully'));
});

/**
 * Close Assignment.
 */
export const closeAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = await Assignment.findByIdAndUpdate(id, { status: 'Closed' }, { new: true });

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  res.status(200).json(new ApiResponse(200, assignment, 'Assignment closed successfully'));
});

/**
 * View submissions under an assignment (Teachers/Admins only).
 */
export const getAssignmentSubmissions = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // assignment ID
  const { page = 1, limit = 10, status } = req.query;

  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  const filter: any = { assignmentId: id };
  if (status) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const submissions = await Submission.find(filter)
    .populate('studentId', 'firstName lastName username email avatar')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Submission.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        submissions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Submissions for assignment retrieved successfully'
    )
  );
});
