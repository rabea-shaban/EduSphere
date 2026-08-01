import api from "./api";
import { ApiResponse } from "@/features/dashboard/types/api";

export interface UploadResponse {
  url: string;
  key: string;
  publicId?: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration?: number;
  quality?: string;
}

export const uploadService = {
  /**
   * Upload an image file with progress callback using multipart/form-data.
   */
  async uploadImage(
    file: File,
    folder: string = "thumbnails",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const resData: any = response.data.data;
    return {
      url: resData.url,
      key: resData.key || resData.publicId || "",
      publicId: resData.key || resData.publicId || "",
      originalName: resData.originalName || file.name,
      mimeType: resData.mimeType || resData.mimetype || file.type,
      size: resData.size || file.size,
    };
  },

  /**
   * Upload a video file with progress callback using multipart/form-data.
   */
  async uploadVideo(
    file: File,
    folder: string = "videos",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const resData: any = response.data.data;
    return {
      url: resData.url,
      key: resData.key || resData.publicId || "",
      publicId: resData.key || resData.publicId || "",
      originalName: resData.originalName || file.name,
      mimeType: resData.mimeType || resData.mimetype || file.type,
      size: resData.size || file.size,
      duration: resData.duration,
      quality: resData.quality,
    };
  },

  /**
   * Upload a PDF or document file with progress callback using multipart/form-data.
   */
  async uploadDocument(
    file: File,
    folder: string = "lessons",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const resData: any = response.data.data;
    return {
      url: resData.url,
      key: resData.key || resData.publicId || "",
      publicId: resData.key || resData.publicId || "",
      originalName: resData.originalName || file.name,
      mimeType: resData.mimeType || resData.mimetype || file.type,
      size: resData.size || file.size,
    };
  },

  /**
   * Upload an audio file with progress callback using multipart/form-data.
   */
  async uploadAudio(
    file: File,
    folder: string = "lessons/audio",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse>>("/upload/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const resData: any = response.data.data;
    return {
      url: resData.url,
      key: resData.key || resData.publicId || "",
      publicId: resData.key || resData.publicId || "",
      originalName: resData.originalName || file.name,
      mimeType: resData.mimeType || resData.mimetype || file.type,
      size: resData.size || file.size,
    };
  },

  /**
   * Upload multiple files with progress callback using multipart/form-data.
   */
  async uploadMultiple(
    files: File[],
    folder: string = "courses",
    onProgress?: (percent: number) => void
  ): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folder);

    const response = await api.post<ApiResponse<UploadResponse[]>>("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    const items: any[] = response.data.data || [];
    return items.map((resData, idx) => ({
      url: resData.url,
      key: resData.key || resData.publicId || "",
      publicId: resData.key || resData.publicId || "",
      originalName: resData.originalName || files[idx]?.name || "file",
      mimeType: resData.mimeType || resData.mimetype || files[idx]?.type || "application/octet-stream",
      size: resData.size || files[idx]?.size || 0,
    }));
  },

  /**
   * Delete uploaded file by object key from Cloudflare R2.
   */
  async deleteFile(key: string, _resourceType?: string): Promise<void> {
    if (!key) return;
    await api.delete(`/upload/${encodeURIComponent(key)}`);
  },
};

export default uploadService;
