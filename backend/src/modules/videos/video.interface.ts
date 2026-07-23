import { Document, Types } from 'mongoose';

export type VideoProvider = 'Cloudinary';
export type VideoQuality = '360' | '480' | '720' | '1080';

export interface ICaption {
  language: string;
  url: string;
}

export interface IVideo {
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  provider: VideoProvider;
  videoUrl: string;
  publicId?: string;
  thumbnail?: string;
  duration: number; // in seconds
  quality: VideoQuality;
  captions: ICaption[];
  isPreview: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVideoDocument extends IVideo, Document {}
