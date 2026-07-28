export type FileCategory = 'all' | 'image' | 'video' | 'document' | 'archive' | 'audio' | 'code' | 'other';
export type CloudProvider = 'cloudinary' | 's3' | 'azure' | 'local';

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  quality?: string;
  encoding?: string;
}

export interface RelatedEntity {
  entityType: 'course' | 'lesson' | 'assignment' | 'profile' | 'general';
  entityId?: string;
}

export interface FileAsset {
  id: string;
  originalName: string;
  storedName: string;
  publicUrl: string;
  secureUrl: string;
  fileSize: number; // bytes
  extension: string;
  mimeType: string;
  category: FileCategory;
  relatedEntity?: RelatedEntity;
  folder: string;
  cloudProvider: CloudProvider;
  cloudProviderId?: string;
  isDeleted: boolean;
  deletedAt?: string;
  downloadCount: number;
  metadata?: FileMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface FileQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: FileCategory;
  folder?: string;
  sort?: 'newest' | 'oldest' | 'largest' | 'smallest' | 'name';
  deleted?: boolean;
}

export interface FileStats {
  totalFiles: number;
  totalStorageBytes: number;
  totalStorageMB: string;
  byCategory: Record<string, { count: number; bytes: number }>;
}

export interface UploadFileInput {
  file: File;
  folder?: string;
  entityType?: string;
  entityId?: string;
}

export interface UpdateFileMetadataInput {
  originalName?: string;
  folder?: string;
  entityType?: string;
  entityId?: string;
}
