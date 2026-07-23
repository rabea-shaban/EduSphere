import { Document, Types } from 'mongoose';

export type ResourceType = 'PDF' | 'Image' | 'ZIP' | 'Code' | 'Document' | 'External Link';

export interface IResource {
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  resourceType: ResourceType;
  url: string;
  publicId?: string; // Cloudinary public ID if stored there
  size: number; // size in bytes
  extension?: string; // file extension, e.g. .pdf, .zip
  downloadable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResourceDocument extends IResource, Document {}
