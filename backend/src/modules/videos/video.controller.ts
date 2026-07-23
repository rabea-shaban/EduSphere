import { Request, Response } from 'express';
import fs from 'fs';
import { Video } from './video.model';
import {
  uploadVideoToCloudinary,
  deleteFromCloudinary,
} from '../../config/cloudinary';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Handle video upload and metadata creation.
 */
export const uploadVideoFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a video file');
  }

  const { title, description, lessonId, courseId, isPreview, isPublished, captions } = req.body;

  let uploadResult;
  try {
    // 1. Upload local temporary file to Cloudinary
    uploadResult = await uploadVideoToCloudinary(req.file.path);
  } finally {
    // 2. Always delete local temporary file immediately to conserve space
    fs.promises.unlink(req.file.path).catch((err) => {
      console.error(`[Upload Cleanup] Failed to delete local temp file at ${req.file?.path}:`, err);
    });
  }

  // 3. Create video document in database
  const video = await Video.create({
    lessonId,
    courseId,
    title,
    description,
    provider: 'Cloudinary',
    videoUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    duration: uploadResult.duration,
    quality: uploadResult.quality as any,
    isPreview: isPreview === 'true' || isPreview === true,
    isPublished: isPublished === undefined ? true : (isPublished === 'true' || isPublished === true),
    captions: captions ? (typeof captions === 'string' ? JSON.parse(captions) : captions) : [],
  });

  res.status(201).json(new ApiResponse(201, video, 'Video uploaded successfully'));
});

/**
 * Get all videos with filters and pagination.
 */
export const getAllVideos = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, courseId, lessonId, search, isPublished } = req.query;
  const filter: any = {};

  if (courseId) filter.courseId = courseId;
  if (lessonId) filter.lessonId = lessonId;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  if (search) filter.title = new RegExp(search as string, 'i');

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const videos = await Video.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Video.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Videos retrieved successfully'
    )
  );
});

/**
 * Get Video by ID.
 */
export const getVideoById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  res.status(200).json(new ApiResponse(200, video, 'Video retrieved successfully'));
});

/**
 * Update video metadata.
 */
export const updateVideoMetadata = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  Object.assign(video, req.body);
  await video.save();

  res.status(200).json(new ApiResponse(200, video, 'Video details updated successfully'));
});

/**
 * Delete video from database and delete from Cloudinary storage.
 */
export const deleteVideoFile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  // 1. Delete asset from Cloudinary
  if (video.publicId) {
    await deleteFromCloudinary(video.publicId, 'video');
  }

  // 2. Delete document from database
  await video.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Video file deleted successfully'));
});

/**
 * Publish video.
 */
export const publishVideoFile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findByIdAndUpdate(id, { isPublished: true }, { new: true });

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  res.status(200).json(new ApiResponse(200, video, 'Video published successfully'));
});
