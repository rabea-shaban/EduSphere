import api from "./api";
import { ApiResponse } from "@/features/dashboard/types/api";

export interface UploadResponse {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration?: number;
  quality?: string;
}

export const uploadService = {
  /**
   * Upload an image file with progress callback.
   */
  async uploadImage(
    file: File,
    folder: string = "edusphere/images",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data.data;
  },

  /**
   * Upload a video file with progress callback.
   */
  async uploadVideo(
    file: File,
    folder: string = "edusphere/videos",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data.data;
  },

  /**
   * Upload a document file (PDF, DOCX, ZIP) with progress callback.
   */
  async uploadDocument(
    file: File,
    folder: string = "edusphere/documents",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data.data;
  },

  /**
   * Delete uploaded asset from Cloudinary.
   */
  async deleteFile(publicId: string, resourceType: "image" | "video" | "raw" = "image"): Promise<void> {
    await api.delete(`/upload/${encodeURIComponent(publicId)}`, {
      params: { resourceType },
    });
  },
};

export default uploadService;
