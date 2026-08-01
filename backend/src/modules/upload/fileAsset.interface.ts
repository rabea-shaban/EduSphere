import { Schema, Document } from 'mongoose';

export type FileCategory = 'image' | 'video' | 'document' | 'archive' | 'audio' | 'code' | 'other';
export type CloudProvider = 'cloudinary' | 's3' | 'azure' | 'local' | 'r2';

export interface IRelatedEntity {
  entityType: 'course' | 'lesson' | 'assignment' | 'profile' | 'general';
  entityId?: Schema.Types.ObjectId;
}

export interface IFileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for videos/audio in seconds
  quality?: string;
  encoding?: string;
}

export interface IFileAsset {
  owner: Schema.Types.ObjectId;
  originalName: string;
  storedName: string;
  publicUrl: string;
  secureUrl: string;
  fileSize: number; // in bytes
  extension: string;
  mimeType: string;
  category: FileCategory;
  relatedEntity?: IRelatedEntity;
  folder: string;
  cloudProvider: CloudProvider;
  cloudProviderId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  downloadCount: number;
  metadata?: IFileMetadata;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFileAssetDocument extends IFileAsset, Document {}
