import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Resource } from './resource.model';
import {
  uploadResourceToCloudinary,
  deleteFromCloudinary,
} from '../../config/cloudinary';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Handle resource creation (file upload or external links).
 */
export const uploadResourceFile = catchAsync(async (req: Request, res: Response) => {
  const { title, description, lessonId, courseId, resourceType, downloadable, url } = req.body;

  let fileUrl = url;
  let publicId = '';
  let size = 0;
  let extension = '';

  if (resourceType === 'External Link') {
    if (!url) {
      throw new ApiError(400, 'URL is required for External Link resources');
    }
  } else {
    // Expect a file upload
    if (!req.file) {
      throw new ApiError(400, 'Please upload a resource file');
    }

    try {
      // 1. Upload local temporary file to Cloudinary
      const uploadResult = await uploadResourceToCloudinary(req.file.path, resourceType);
      fileUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
      size = req.file.size;
      extension = path.extname(req.file.originalname);
    } finally {
      // 2. Always delete local temporary file immediately
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error(`[Upload Cleanup] Failed to delete local temp file at ${req.file?.path}:`, err);
      });
    }
  }

  // 3. Create resource document in database
  const resource = await Resource.create({
    lessonId,
    courseId,
    title,
    description,
    resourceType,
    url: fileUrl,
    publicId,
    size,
    extension,
    downloadable: downloadable === undefined ? true : (downloadable === 'true' || downloadable === true),
  });

  res.status(201).json(new ApiResponse(201, resource, 'Resource created successfully'));
});

/**
 * Get all resources of a lesson.
 */
export const getLessonResources = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  const resources = await Resource.find({ lessonId });
  res.status(200).json(new ApiResponse(200, resources, 'Lesson resources retrieved successfully'));
});

/**
 * Delete a resource from database and storage.
 */
export const deleteResourceFile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const resource = await Resource.findById(id);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // 1. Delete asset from Cloudinary
  if (resource.publicId) {
    const isImage = resource.resourceType === 'Image';
    const cloudinaryResourceType = isImage ? 'image' : 'raw';
    await deleteFromCloudinary(resource.publicId, cloudinaryResourceType);
  }

  // 2. Delete document from database
  await resource.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Resource file deleted successfully'));
});
