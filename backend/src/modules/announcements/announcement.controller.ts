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
  if (!announcementData.teacherId && req.user) {
    announcementData.teacherId = req.user._id;
  }

  const announcement = await Announcement.create(announcementData);
  res.status(201).json(new ApiResponse(201, announcement, 'Announcement posted successfully'));
});

/**
 * Retrieve announcements filtered by dynamic target audience scopes.
 */
export const getAllAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, courseId, gradeId } = req.query;
  const filter: any = { isPublished: true, publishAt: { $lte: new Date() } };

  // If teacher or admin, bypass target filters and let them see drafts/expired entries
  if (req.user && ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(req.user.role)) {
    delete filter.isPublished;
    delete filter.publishAt;
    if (req.user.role === 'TEACHER') {
      filter.teacherId = req.user._id;
    }
  } else if (req.user && req.user.role === 'STUDENT') {
    // If student, filter announcements targeting them:
    // 1. targetAudience: 'All'
    // 2. targetAudience: 'Grade' where student's grade is in targetIds
    // 3. targetAudience: 'Course' where student is enrolled in the courses in targetIds
    // 4. targetAudience: 'Specific Students' where student ID is in targetIds

    // Load student's active course IDs
    const enrollments = await Enrollment.find({ studentId: req.user._id, status: 'Active' });
    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    const studentGrade = (req.user as any).grade;

    filter.$or = [
      { targetAudience: 'All' },
      { targetAudience: 'Specific Students', targetIds: req.user._id },
    ];

    if (studentGrade) {
      filter.$or.push({ targetAudience: 'Grade', targetIds: studentGrade });
    }

    if (enrolledCourseIds.length > 0) {
      filter.$or.push({ targetAudience: 'Course', targetIds: { $in: enrolledCourseIds } });
    }
  }

  // Direct query override checks
  if (courseId) {
    filter.$or = filter.$or || [];
    filter.$or.push({ targetAudience: 'Course', targetIds: courseId });
  }
  if (gradeId) {
    filter.$or = filter.$or || [];
    filter.$or.push({ targetAudience: 'Grade', targetIds: gradeId });
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const announcements = await Announcement.find(filter)
    .populate('teacherId', 'firstName lastName email avatar')
    .sort({ publishAt: -1 })
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
  const announcement = await Announcement.findById(id).populate('teacherId', 'firstName lastName email avatar');

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
  if (req.user && req.user.role === 'TEACHER' && announcement.teacherId.toString() !== req.user._id.toString()) {
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
  if (req.user && req.user.role === 'TEACHER' && announcement.teacherId.toString() !== req.user._id.toString()) {
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
  if (req.user && req.user.role === 'TEACHER' && announcement.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this announcement');
  }

  announcement.isPublished = true;
  announcement.publishAt = new Date();
  await announcement.save();

  res.status(200).json(new ApiResponse(200, announcement, 'Announcement published successfully'));
});
export default createAnnouncement;
