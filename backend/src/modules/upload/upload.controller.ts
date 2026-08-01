import { Request, Response } from 'express';
import { r2Service } from '../../services/r2.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import { UploadFolders } from '../../constants/uploadFolders';

/**
 * Handle Image Upload (Avatars, Thumbnails, CMS, Logos, Certificates) via Cloudflare R2
 */
export const uploadImageFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار صورة رفع صالحة');
  }

  const folder = (req.body.folder as string) || UploadFolders.THUMBNAIL;
  const result = await r2Service.uploadFile({ file: req.file, folder });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
      },
      'تم رفع الصورة بنجاح'
    )
  );
});

/**
 * Handle Video Upload (Course Videos, Lessons, Demo Videos) via Cloudflare R2
 */
export const uploadVideoFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار ملف فيديو صالح');
  }

  const folder = (req.body.folder as string) || UploadFolders.VIDEO;
  const result = await r2Service.uploadFile({ file: req.file, folder });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
      },
      'تم رفع الفيديو بنجاح'
    )
  );
});

/**
 * Handle Document Upload (PDF, DOCX, ZIP, PPTX, XLS) via Cloudflare R2
 */
export const uploadDocumentFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'الرجاء اختيار ملف مستند صالح');
  }

  const folder = (req.body.folder as string) || UploadFolders.LESSON;
  const result = await r2Service.uploadFile({ file: req.file, folder });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimetype,
        size: result.size,
      },
      'تم رفع المستند بنجاح'
    )
  );
});

/**
 * Delete asset from Cloudflare R2
 */
export const deleteFileAsset = catchAsync(async (req: Request, res: Response) => {
  const key = String(req.params.publicId || req.params.key || req.query.key || '');

  if (!key) {
    throw new ApiError(400, 'معرف المفتاح (key) مطلوب للحذف');
  }

  await r2Service.deleteFile(key);

  res.status(200).json(new ApiResponse(200, { key }, 'تم حذف الملف بنجاح من Cloudflare R2'));
});
