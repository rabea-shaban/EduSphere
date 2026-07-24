import { Request, Response } from 'express';
import { Announcement } from './announcement.model';
import { Enrollment } from '../enrollments/enrollment.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Create a new announcement.
 */
export const createAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const announcementData = { ...req.body };
  if (!announcementData.createdBy && req.user) {
    announcementData.createdBy = req.user._id;
  }

  const announcement = await Announcement.create(announcementData);
  res.status(201).json(new ApiResponse(201, announcement, 'Announcement posted successfully'));
});

/**
 * Retrieve announcements filtered by dynamic target audience scopes.
 */
export const getAllAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, courseId, gradeId } = req.query;
  const filter: any = { status: 'Published', publishDate: { $lte: new Date() } };

  // If teacher or admin, bypass target filters and let them see drafts/expired entries
  if (req.user && ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(req.user.role)) {
    delete filter.status;
    delete filter.publishDate;
    if (req.user.role === 'TEACHER') {
      filter.createdBy = req.user._id;
    }
  } else if (req.user) {
    // Determine audience classifications based on user role
    const userRole = req.user.role; // e.g. 'STUDENT', 'TEACHER', 'PARENT'
    const studentGrade = (req.user as any).grade;

    filter.$or = [
      { targetType: 'All Users' },
    ];

    if (userRole === 'STUDENT') {
      filter.$or.push({ targetType: 'Students' });

      if (studentGrade) {
        filter.$or.push({ targetType: 'Specific Grade', targetIds: studentGrade });
      }

      // Load student's active course IDs
      const enrollments = await Enrollment.find({ studentId: req.user._id, status: 'Active' });
      const enrolledCourseIds = enrollments.map((e) => e.courseId);

      if (enrolledCourseIds.length > 0) {
        filter.$or.push({ targetType: 'Specific Course', targetIds: { $in: enrolledCourseIds } });
      }
    } else if (userRole === 'TEACHER') {
      filter.$or.push({ targetType: 'Teachers' });
    } else if (userRole === 'PARENT') {
      filter.$or.push({ targetType: 'Parents' });
    }
  }

  // Direct query overrides
  if (courseId) {
    filter.$or = filter.$or || [];
    filter.$or.push({ targetType: 'Specific Course', targetIds: courseId });
  }
  if (gradeId) {
    filter.$or = filter.$or || [];
    filter.$or.push({ targetType: 'Specific Grade', targetIds: gradeId });
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const announcements = await Announcement.find(filter)
    .populate('createdBy', 'firstName lastName email avatar')
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Announcement.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        announcements,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Announcements retrieved successfully'
    )
  );
});

/**
 * Get Announcement by ID.
 */
export const getAnnouncementById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id).populate('createdBy', 'firstName lastName email avatar');

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  res.status(200).json(new ApiResponse(200, announcement, 'Announcement retrieved successfully'));
});

/**
 * Update Announcement.
 */
export const updateAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && announcement.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this announcement');
  }

  Object.assign(announcement, req.body);
  await announcement.save();

  res.status(200).json(new ApiResponse(200, announcement, 'Announcement updated successfully'));
});

/**
 * Delete Announcement.
 */
export const deleteAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && announcement.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to delete this announcement');
  }

  await announcement.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Announcement deleted successfully'));
});

/**
 * Publish Announcement immediately.
 */
export const publishAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && announcement.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this announcement');
  }

  announcement.status = 'Published';
  announcement.publishDate = new Date();
  await announcement.save();

  res.status(200).json(new ApiResponse(200, announcement, 'Announcement published successfully'));
});

/**
 * Archive Announcement.
 */
export const archiveAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  // Enforce ownership if teacher
  if (req.user && req.user.role === 'TEACHER' && announcement.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this announcement');
  }

  announcement.status = 'Archived';
  await announcement.save();

  res.status(200).json(new ApiResponse(200, announcement, 'Announcement archived successfully'));
});
export default createAnnouncement;
