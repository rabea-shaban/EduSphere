import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { FileAssetService } from './fileAsset.service';

const getReqInfo = (req: Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return {
    ipAddress: rawIp || req.socket.remoteAddress || '127.0.0.1',
    userAgent: (req.headers['user-agent'] as string) || 'Unknown Agent',
    userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
    userRole: req.user?.role,
  };
};

/**
 * POST /teacher/files/upload
 */
export const uploadSingleFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  if (!req.file) throw new ApiError(400, 'يرجى تحديد ملف للرفع');

  const reqInfo = getReqInfo(req);
  const result = await FileAssetService.uploadSingleFile(req.file, req.user._id, req.body, reqInfo);

  res.status(201).json(new ApiResponse(201, result, 'تم رفع الملف بنجاح'));
});

/**
 * POST /teacher/files/upload-multiple
 */
export const uploadMultipleFiles = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) throw new ApiError(400, 'يرجى تحديد ملفات للرفع');

  const reqInfo = getReqInfo(req);
  const results = await FileAssetService.uploadMultipleFiles(files, req.user._id, req.body, reqInfo);

  res.status(201).json(new ApiResponse(201, results, 'تم رفع الملفات بنجاح'));
});

/**
 * GET /teacher/files
 */
export const getTeacherFiles = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const result = await FileAssetService.getTeacherFiles(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'تم جلب قائمة الملفات بنجاح'));
});

/**
 * GET /teacher/files/stats
 */
export const getFileStats = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const stats = await FileAssetService.getFileStats(req.user._id);
  res.status(200).json(new ApiResponse(200, stats, 'تم جلب إحصائيات التخزين بنجاح'));
});

/**
 * GET /teacher/files/:id
 */
export const getFileById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const file = await FileAssetService.getFileById(req.params.id as string, req.user._id);
  res.status(200).json(new ApiResponse(200, file, 'تم جلب تفاصيل الملف بنجاح'));
});

/**
 * PATCH /teacher/files/:id
 */
export const updateFileMetadata = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const updatedFile = await FileAssetService.updateFileMetadata(req.params.id as string, req.user._id, req.body, reqInfo);
  res.status(200).json(new ApiResponse(200, updatedFile, 'تم تحديث بيانات الملف بنجاح'));
});

/**
 * DELETE /teacher/files/:id
 */
export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const isPermanent = req.query.permanent === 'true';
  const result = await FileAssetService.softDeleteFile(req.params.id as string, req.user._id, isPermanent, reqInfo);
  res.status(200).json(new ApiResponse(200, result, isPermanent ? 'تم حذف الملف نهائياً' : 'تم نقل الملف إلى سلة المهملات'));
});

/**
 * PATCH /teacher/files/:id/restore
 */
export const restoreFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const restoredFile = await FileAssetService.restoreFile(req.params.id as string, req.user._id, reqInfo);
  res.status(200).json(new ApiResponse(200, restoredFile, 'تم استعادة الملف بنجاح'));
});

/**
 * GET /teacher/files/:id/download
 */
export const downloadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const reqInfo = getReqInfo(req);
  const downloadInfo = await FileAssetService.getDownloadStream(req.params.id as string, req.user._id, reqInfo);
  res.status(200).json(new ApiResponse(200, downloadInfo, 'تم تجهيز رابط التحميل بنجاح'));
});

/**
 * GET /teacher/files/:id/preview
 */
export const previewFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const file = await FileAssetService.getFileById(req.params.id as string, req.user._id);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: file._id,
        originalName: file.originalName,
        publicUrl: file.publicUrl,
        secureUrl: file.secureUrl,
        category: file.category,
        mimeType: file.mimeType,
        metadata: file.metadata,
      },
      'تم جلب معاينة الملف بنجاح'
    )
  );
});
