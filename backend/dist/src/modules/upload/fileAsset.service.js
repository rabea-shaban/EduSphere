"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetService = void 0;
const mongoose_1 = require("mongoose");
const fileAsset_model_1 = __importDefault(require("./fileAsset.model"));
const fileStorage_service_1 = require("./fileStorage.service");
const activityLog_model_1 = __importDefault(require("../activityLogs/activityLog.model"));
const ApiError_1 = require("../../utils/ApiError");
const path_1 = __importDefault(require("path"));
class FileAssetService {
    static parseId(id) {
        return typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
    }
    /**
     * Upload a single file
     */
    static async uploadSingleFile(file, ownerIdInput, payload, reqInfo) {
        if (!file)
            throw new ApiError_1.ApiError(400, 'الرجاء تحديد ملف للرفع');
        const ownerId = this.parseId(ownerIdInput);
        const folder = payload.folder || 'general';
        const storageResult = await fileStorage_service_1.FileStorageService.uploadFileToStorage(file, folder);
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const storedName = `${file.fieldname}-${Date.now()}${ext}`;
        const fileAsset = await fileAsset_model_1.default.create({
            owner: ownerId,
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
                entityType: payload.entityType || 'general',
                entityId: payload.entityId ? this.parseId(payload.entityId) : undefined,
            },
            metadata: storageResult.metadata,
        });
        await activityLog_model_1.default.create({
            userId: ownerId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `رفع ملف جديد: ${file.originalname}`,
            category: 'Settings',
            module: 'MediaLibrary',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return fileAsset;
    }
    /**
     * Upload multiple files (bulk)
     */
    static async uploadMultipleFiles(files, ownerIdInput, payload, reqInfo) {
        if (!files || files.length === 0)
            throw new ApiError_1.ApiError(400, 'الرجاء تحديد ملف واحد على الأقل للرفع');
        const uploadedAssets = [];
        for (const file of files) {
            const asset = await this.uploadSingleFile(file, ownerIdInput, payload, reqInfo);
            uploadedAssets.push(asset);
        }
        return uploadedAssets;
    }
    /**
     * Get teacher files with pagination, search, filters, sorting
     */
    static async getTeacherFiles(ownerIdInput, query) {
        const ownerId = this.parseId(ownerIdInput);
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;
        const filter = { owner: ownerId };
        // Handle soft deleted toggle
        const isDeleted = query.deleted === true || query.deleted === 'true';
        filter.isDeleted = isDeleted;
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
        let sort = { createdAt: -1 };
        if (query.sort === 'oldest')
            sort = { createdAt: 1 };
        if (query.sort === 'largest')
            sort = { fileSize: -1 };
        if (query.sort === 'smallest')
            sort = { fileSize: 1 };
        if (query.sort === 'name')
            sort = { originalName: 1 };
        const [files, total] = await Promise.all([
            fileAsset_model_1.default.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            fileAsset_model_1.default.countDocuments(filter),
        ]);
        return {
            files: files.map((f) => ({
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
    static async getFileById(fileIdInput, ownerIdInput) {
        const ownerId = this.parseId(ownerIdInput);
        const file = await fileAsset_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(fileIdInput), owner: ownerId });
        if (!file)
            throw new ApiError_1.ApiError(404, 'الملف غير موجود أو لا تملك صلاحية الوصول إليه');
        return file;
    }
    /**
     * Update file metadata (rename, change folder)
     */
    static async updateFileMetadata(fileIdInput, ownerIdInput, data, reqInfo) {
        const file = await this.getFileById(fileIdInput, ownerIdInput);
        if (data.originalName)
            file.originalName = data.originalName;
        if (data.folder)
            file.folder = data.folder;
        if (data.entityType) {
            file.relatedEntity = {
                entityType: data.entityType,
                entityId: data.entityId ? this.parseId(data.entityId) : undefined,
            };
        }
        await file.save();
        await activityLog_model_1.default.create({
            userId: this.parseId(ownerIdInput),
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `تحديث بيانات الملف: ${file.originalName}`,
            category: 'Settings',
            module: 'MediaLibrary',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return file;
    }
    /**
     * Soft delete or permanently remove file
     */
    static async softDeleteFile(fileIdInput, ownerIdInput, permanent = false, reqInfo) {
        const file = await this.getFileById(fileIdInput, ownerIdInput);
        if (permanent) {
            await fileStorage_service_1.FileStorageService.deleteFileFromStorage(file.cloudProviderId || '', file.category);
            await fileAsset_model_1.default.deleteOne({ _id: file._id });
            await activityLog_model_1.default.create({
                userId: this.parseId(ownerIdInput),
                userName: reqInfo.userName,
                userRole: reqInfo.userRole || 'TEACHER',
                action: `حذف نهائي للملف: ${file.originalName}`,
                category: 'Settings',
                module: 'MediaLibrary',
                status: 'WARNING',
                ipAddress: reqInfo.ipAddress,
                userAgent: reqInfo.userAgent,
            }).catch(() => { });
            return { success: true, message: 'تم حذف الملف نهائياً' };
        }
        file.isDeleted = true;
        file.deletedAt = new Date();
        await file.save();
        await activityLog_model_1.default.create({
            userId: this.parseId(ownerIdInput),
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `نقل الملف إلى سلة المهملات: ${file.originalName}`,
            category: 'Settings',
            module: 'MediaLibrary',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return file;
    }
    /**
     * Restore soft-deleted file
     */
    static async restoreFile(fileIdInput, ownerIdInput, reqInfo) {
        const ownerId = this.parseId(ownerIdInput);
        const file = await fileAsset_model_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(fileIdInput), owner: ownerId, isDeleted: true });
        if (!file)
            throw new ApiError_1.ApiError(404, 'الملف غير موجود في سلة المهملات');
        file.isDeleted = false;
        file.deletedAt = undefined;
        await file.save();
        await activityLog_model_1.default.create({
            userId: ownerId,
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `استعادة الملف من سلة المهملات: ${file.originalName}`,
            category: 'Settings',
            module: 'MediaLibrary',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
        return file;
    }
    /**
     * Track file download & return URL
     */
    static async getDownloadStream(fileIdInput, ownerIdInput, reqInfo) {
        const file = await this.getFileById(fileIdInput, ownerIdInput);
        file.downloadCount += 1;
        await file.save();
        await activityLog_model_1.default.create({
            userId: this.parseId(ownerIdInput),
            userName: reqInfo.userName,
            userRole: reqInfo.userRole || 'TEACHER',
            action: `تحميل الملف: ${file.originalName}`,
            category: 'Settings',
            module: 'MediaLibrary',
            status: 'SUCCESS',
            ipAddress: reqInfo.ipAddress,
            userAgent: reqInfo.userAgent,
        }).catch(() => { });
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
    static async getFileStats(ownerIdInput) {
        const ownerId = this.parseId(ownerIdInput);
        const stats = await fileAsset_model_1.default.aggregate([
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
            byCategory: stats.reduce((acc, curr) => {
                acc[curr._id] = { count: curr.count, bytes: curr.totalSize };
                return acc;
            }, {}),
        };
    }
}
exports.FileAssetService = FileAssetService;
