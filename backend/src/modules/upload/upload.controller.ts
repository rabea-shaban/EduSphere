import { Request, Response } from 'express';
import { uploadResourceToCloudinary, uploadVideoToCloudinary, deleteFromCloudinary } from '../../config/cloudinary';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import fs from 'fs';

/**
 * Handle Image Upload (Avatars, Thumbnails, CMS, Logos, Certificates)
 */
export const uploadImageFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار صورة رفع صالحة');
  }

  const uploadResult = await uploadResourceToCloudinary(req.file.path || (req.file.buffer as any), 'Image');

  // Clean local temp file if created
  if (req.file.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      'تم رفع الصورة بنجاح'
    )
  );
});

/**
 * Handle Video Upload (Course Videos, Lessons, Demo Videos)
 */
export const uploadVideoFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار ملف فيديو صالح');
  }

  const uploadResult = await uploadVideoToCloudinary(req.file.path || (req.file.buffer as any));

  if (req.file.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: uploadResult.duration,
        quality: uploadResult.quality,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      'تم رفع الفيديو بنجاح'
    )
  );
});

/**
 * Handle Document Upload (PDF, DOCX, ZIP, PPTX, XLS)
 */
export const uploadDocumentFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار ملف مستند صالح');
  }

  const resourceType = req.file.mimetype.includes('pdf') ? 'PDF' : 'RAW';
  const uploadResult = await uploadResourceToCloudinary(req.file.path || (req.file.buffer as any), resourceType);

  if (req.file.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      'تم رفع المستند بنجاح'
    )
  );
});

/**
 * Delete asset from Cloudinary
 */
export const deleteFileAsset = catchAsync(async (req: Request, res: Response) => {
  const publicId = String(req.params.publicId || '');
  const resourceType = (String(req.query.resourceType || 'image')) as 'video' | 'image' | 'raw';

  if (!publicId) {
    throw new ApiError(400, 'معرف الملف (publicId) مطلوب للحذف');
  }

  await deleteFromCloudinary(publicId, resourceType);

  res.status(200).json(new ApiResponse(200, { publicId }, 'تم حذف الملف بنجاح من الخادم'));
});
