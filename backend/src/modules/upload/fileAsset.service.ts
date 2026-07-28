import { Types } from 'mongoose';
import FileAsset from './fileAsset.model';
import { FileStorageService } from './fileStorage.service';
import ActivityLog from '../activityLogs/activityLog.model';
import { ApiError } from '../../utils/ApiError';
import path from 'path';

interface IReqInfo {
  ipAddress?: string;
  userAgent?: string;
  userName?: string;
  userRole?: string;
}

export class FileAssetService {
  private static parseId(id: any): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  /**
   * Upload a single file
   */
  static async uploadSingleFile(
    file: Express.Multer.File,
    ownerIdInput: any,
    payload: { folder?: string; entityType?: string; entityId?: string },
    reqInfo: IReqInfo
  ) {
    if (!file) throw new ApiError(400, 'الرجاء تحديد ملف للرفع');

    const ownerId = this.parseId(ownerIdInput);
    const folder = payload.folder || 'general';
    const storageResult = await FileStorageService.uploadFileToStorage(file, folder);

    const ext = path.extname(file.originalname).toLowerCase();
    const storedName = `${file.fieldname}-${Date.now()}${ext}`;

    const fileAsset = await FileAsset.create({
      owner: ownerId as any,
      originalName: file.originalname,
      storedName,
      publicUrl: storageResult.publicUrl,
      secureUrl: storageResult.secureUrl,
      fileSize: file.size,
      extension: ext.replace('.', ''),
      mimeType: file.mimetype,
      category: storageResult.category,
      folder,
      cloudProvider: storageResult.cloudProvider,
      cloudProviderId: storageResult.cloudProviderId,
      relatedEntity: {
        entityType: (payload.entityType as any) || 'general',
        entityId: payload.entityId ? (this.parseId(payload.entityId) as any) : undefined,
      },
      metadata: storageResult.metadata,
    });

    await ActivityLog.create({
      userId: ownerId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `رفع ملف جديد: ${file.originalname}`,
      category: 'Settings',
      module: 'MediaLibrary',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return fileAsset;
  }

  /**
   * Upload multiple files (bulk)
   */
  static async uploadMultipleFiles(
    files: Express.Multer.File[],
    ownerIdInput: any,
    payload: { folder?: string; entityType?: string; entityId?: string },
    reqInfo: IReqInfo
  ) {
    if (!files || files.length === 0) throw new ApiError(400, 'الرجاء تحديد ملف واحد على الأقل للرفع');

    const uploadedAssets: any[] = [];
    for (const file of files) {
      const asset = await this.uploadSingleFile(file, ownerIdInput, payload, reqInfo);
      uploadedAssets.push(asset);
    }
    return uploadedAssets;
  }

  /**
   * Get teacher files with pagination, search, filters, sorting
   */
  static async getTeacherFiles(ownerIdInput: any, query: any) {
    const ownerId = this.parseId(ownerIdInput);
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const filter: any = { owner: ownerId as any };

    // Handle soft deleted toggle
    if (query.deleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = false;
    }

    // Category filter
    if (query.category && query.category !== 'all') {
      filter.category = query.category;
    }

    // Folder filter
    if (query.folder) {
      filter.folder = query.folder;
    }

    // Search filter
    if (query.search) {
      filter.originalName = { $regex: query.search, $options: 'i' };
    }

    // Sort options
    let sort: any = { createdAt: -1 };
    if (query.sort === 'oldest') sort = { createdAt: 1 };
    if (query.sort === 'largest') sort = { fileSize: -1 };
    if (query.sort === 'smallest') sort = { fileSize: 1 };
    if (query.sort === 'name') sort = { originalName: 1 };

    const [files, total] = await Promise.all([
      FileAsset.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      FileAsset.countDocuments(filter),
    ]);

    return {
      files: files.map((f: any) => ({
        id: f._id.toString(),
        originalName: f.originalName,
        storedName: f.storedName,
        publicUrl: f.publicUrl,
        secureUrl: f.secureUrl,
        fileSize: f.fileSize,
        extension: f.extension,
        mimeType: f.mimeType,
        category: f.category,
        folder: f.folder,
        cloudProvider: f.cloudProvider,
        cloudProviderId: f.cloudProviderId,
        isDeleted: f.isDeleted,
        deletedAt: f.deletedAt,
        downloadCount: f.downloadCount,
        metadata: f.metadata,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get file by ID with ownership check
   */
  static async getFileById(fileIdInput: string, ownerIdInput: any) {
    const ownerId = this.parseId(ownerIdInput);
    const file = await FileAsset.findOne({ _id: new Types.ObjectId(fileIdInput), owner: ownerId as any });
    if (!file) throw new ApiError(404, 'الملف غير موجود أو لا تملك صلاحية الوصول إليه');
    return file;
  }

  /**
   * Update file metadata (rename, change folder)
   */
  static async updateFileMetadata(
    fileIdInput: string,
    ownerIdInput: any,
    data: { originalName?: string; folder?: string; entityType?: string; entityId?: string },
    reqInfo: IReqInfo
  ) {
    const file = await this.getFileById(fileIdInput, ownerIdInput);

    if (data.originalName) file.originalName = data.originalName;
    if (data.folder) file.folder = data.folder;
    if (data.entityType) {
      file.relatedEntity = {
        entityType: data.entityType as any,
        entityId: data.entityId ? (this.parseId(data.entityId) as any) : undefined,
      };
    }

    await file.save();

    await ActivityLog.create({
      userId: this.parseId(ownerIdInput) as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `تحديث بيانات الملف: ${file.originalName}`,
      category: 'Settings',
      module: 'MediaLibrary',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return file;
  }

  /**
   * Soft delete or permanently remove file
   */
  static async softDeleteFile(fileIdInput: string, ownerIdInput: any, permanent: boolean = false, reqInfo: IReqInfo) {
    const file = await this.getFileById(fileIdInput, ownerIdInput);

    if (permanent) {
      await FileStorageService.deleteFileFromStorage(file.cloudProviderId || '', file.category);
      await FileAsset.deleteOne({ _id: file._id });

      await ActivityLog.create({
        userId: this.parseId(ownerIdInput) as any,
        userName: reqInfo.userName,
        userRole: reqInfo.userRole || 'TEACHER',
        action: `حذف نهائي للملف: ${file.originalName}`,
        category: 'Settings',
        module: 'MediaLibrary',
        status: 'WARNING',
        ipAddress: reqInfo.ipAddress,
        userAgent: reqInfo.userAgent,
      } as any).catch(() => {});

      return { success: true, message: 'تم حذف الملف نهائياً' };
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    await ActivityLog.create({
      userId: this.parseId(ownerIdInput) as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `نقل الملف إلى سلة المهملات: ${file.originalName}`,
      category: 'Settings',
      module: 'MediaLibrary',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return file;
  }

  /**
   * Restore soft-deleted file
   */
  static async restoreFile(fileIdInput: string, ownerIdInput: any, reqInfo: IReqInfo) {
    const ownerId = this.parseId(ownerIdInput);
    const file = await FileAsset.findOne({ _id: new Types.ObjectId(fileIdInput), owner: ownerId as any, isDeleted: true });
    if (!file) throw new ApiError(404, 'الملف غير موجود في سلة المهملات');

    file.isDeleted = false;
    file.deletedAt = undefined;
    await file.save();

    await ActivityLog.create({
      userId: ownerId as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `استعادة الملف من سلة المهملات: ${file.originalName}`,
      category: 'Settings',
      module: 'MediaLibrary',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return file;
  }

  /**
   * Track file download & return URL
   */
  static async getDownloadStream(fileIdInput: string, ownerIdInput: any, reqInfo: IReqInfo) {
    const file = await this.getFileById(fileIdInput, ownerIdInput);
    file.downloadCount += 1;
    await file.save();

    await ActivityLog.create({
      userId: this.parseId(ownerIdInput) as any,
      userName: reqInfo.userName,
      userRole: reqInfo.userRole || 'TEACHER',
      action: `تحميل الملف: ${file.originalName}`,
      category: 'Settings',
      module: 'MediaLibrary',
      status: 'SUCCESS',
      ipAddress: reqInfo.ipAddress,
      userAgent: reqInfo.userAgent,
    } as any).catch(() => {});

    return {
      url: file.secureUrl,
      originalName: file.originalName,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
    };
  }

  /**
   * Get storage usage stats
   */
  static async getFileStats(ownerIdInput: any) {
    const ownerId = this.parseId(ownerIdInput);
    const stats = await FileAsset.aggregate([
      { $match: { owner: ownerId, isDeleted: false } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
        },
      },
    ]);

    const totalFiles = stats.reduce((acc, curr) => acc + curr.count, 0);
    const totalStorageBytes = stats.reduce((acc, curr) => acc + curr.totalSize, 0);

    return {
      totalFiles,
      totalStorageBytes,
      totalStorageMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
      byCategory: stats.reduce((acc: any, curr) => {
        acc[curr._id] = { count: curr.count, bytes: curr.totalSize };
        return acc;
      }, {}),
    };
  }
}
