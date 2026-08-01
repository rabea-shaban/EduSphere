import { Request, Response } from 'express';
import { r2Service } from '../services/r2.service';
import { validateFile } from '../utils/fileValidator';
import { UploadFolders } from '../constants/uploadFolders';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { FileAsset } from '../modules/upload/fileAsset.model';

/**
 * Helper function to save file metadata into MongoDB
 */
async function saveMetadataToMongoDB(result: any, category: string, req: Request) {
  try {
    const userId = req.user?._id;
    if (!userId) return; // Skip DB asset tracking if unauthenticated upload

    const catMap: Record<string, any> = {
      IMAGE: 'image',
      DOCUMENT: 'document',
      VIDEO: 'video',
      ARCHIVE: 'archive',
    };
    const assetCategory = catMap[category] || 'other';
    const ext = result.key ? result.key.split('.').pop() || 'bin' : 'bin';

    await FileAsset.create({
      owner: userId,
      originalName: result.originalName || 'file',
      storedName: result.key,
      publicUrl: result.url,
      secureUrl: result.url,
      fileSize: result.size,
      extension: ext,
      mimeType: result.mimetype,
      category: assetCategory,
      cloudProvider: 'r2',
      cloudProviderId: result.key,
    });
  } catch (err) {
    // Log MongoDB error without failing R2 file upload response
    console.warn('⚠️ Warning: File upload succeeded to R2, but MongoDB metadata recording failed:', err);
  }
}

/**
 * POST /upload/image
 * Upload single image (jpg, png, webp, svg) max 10MB
 */
export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No image file uploaded');
  }

  // Validate image
  const validation = validateFile(file, 'IMAGE');
  if (!validation.isValid) {
    throw new ApiError(400, validation.error || 'Invalid image file');
  }

  const folder = (req.body.folder as string) || UploadFolders.THUMBNAIL;
  const result = await r2Service.uploadFile({ file, folder });

  // Save metadata to MongoDB
  await saveMetadataToMongoDB(result, 'IMAGE', req);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

/**
 * POST /upload/pdf
 * Upload single document/PDF max 20MB
 */
export const uploadPdf = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No PDF or document file uploaded');
  }

  // Validate document
  const validation = validateFile(file, 'DOCUMENT');
  if (!validation.isValid) {
    throw new ApiError(400, validation.error || 'Invalid document file');
  }

  const folder = (req.body.folder as string) || UploadFolders.LESSON;
  const result = await r2Service.uploadFile({ file, folder });

  // Save metadata to MongoDB
  await saveMetadataToMongoDB(result, 'DOCUMENT', req);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

/**
 * POST /upload/video
 * Upload single video max 500MB
 */
export const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(400, 'No video file uploaded');
  }

  // Validate video
  const validation = validateFile(file, 'VIDEO');
  if (!validation.isValid) {
    throw new ApiError(400, validation.error || 'Invalid video file');
  }

  const folder = (req.body.folder as string) || UploadFolders.VIDEO;
  const result = await r2Service.uploadFile({ file, folder });

  // Save metadata to MongoDB
  await saveMetadataToMongoDB(result, 'VIDEO', req);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

/**
 * POST /upload/multiple
 * Upload multiple files to Cloudflare R2
 */
export const uploadMultiple = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new ApiError(400, 'No files uploaded');
  }

  // Validate all files
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new ApiError(400, `File ${file.originalname}: ${validation.error}`);
    }
  }

  const folder = (req.body.folder as string) || UploadFolders.COURSE;
  const results = await r2Service.uploadMultipleFiles(files, folder);

  // Save metadata for all files in MongoDB
  for (const resItem of results) {
    await saveMetadataToMongoDB(resItem, 'GENERAL', req);
  }

  res.status(200).json({
    success: true,
    message: 'Files uploaded successfully',
    data: results,
  });
});

/**
 * DELETE /upload/:key(*) or DELETE /upload
 * Delete file from Cloudflare R2 and MongoDB
 */
export const deleteFileByKey = catchAsync(async (req: Request, res: Response) => {
  const keyParam = req.params.key || req.params[0] || (req.query.key as string) || req.body.key;

  if (!keyParam) {
    throw new ApiError(400, 'Object key is required for deletion');
  }

  const key = decodeURIComponent(keyParam);

  await r2Service.deleteFile(key);

  // Remove from MongoDB
  try {
    await FileAsset.deleteOne({ $or: [{ storedName: key }, { publicUrl: key }, { secureUrl: key }] });
  } catch (err) {
    console.warn('⚠️ Warning: File deleted from R2, but MongoDB record deletion failed:', err);
  }

  res.status(200).json({
    success: true,
    message: 'File deleted successfully from Cloudflare R2',
    data: { key },
  });
});

export default {
  uploadImage,
  uploadPdf,
  uploadVideo,
  uploadMultiple,
  deleteFileByKey,
};
