import api from './api';
import type {
  FileAsset,
  FileQueryFilters,
  FileStats,
  UpdateFileMetadataInput,
} from '@/features/teacher/types/files';

export class TeacherFileService {
  /**
   * Upload single file with optional upload progress callback
   */
  async uploadSingleFile(
    file: File,
    payload?: { folder?: string; entityType?: string; entityId?: string },
    onProgress?: (progress: number) => void
  ): Promise<FileAsset> {
    const formData = new FormData();
    formData.append('file', file);
    if (payload?.folder) formData.append('folder', payload.folder);
    if (payload?.entityType) formData.append('entityType', payload.entityType);
    if (payload?.entityId) formData.append('entityId', payload.entityId);

    const res = await api.post<{ data: FileAsset }>('/teacher/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data.data;
  }

  /**
   * Upload multiple files (bulk upload)
   */
  async uploadMultipleFiles(
    files: File[],
    payload?: { folder?: string; entityType?: string; entityId?: string },
    onProgress?: (progress: number) => void
  ): Promise<FileAsset[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (payload?.folder) formData.append('folder', payload.folder);
    if (payload?.entityType) formData.append('entityType', payload.entityType);
    if (payload?.entityId) formData.append('entityId', payload.entityId);

    const res = await api.post<{ data: FileAsset[] }>('/teacher/files/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data.data;
  }

  /**
   * Fetch list of teacher files with filters
   */
  async getFiles(filters?: FileQueryFilters): Promise<{ files: FileAsset[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.folder) params.append('folder', filters.folder);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.deleted !== undefined) params.append('deleted', String(filters.deleted));

    const res = await api.get<{ data: { files: FileAsset[]; pagination: any } }>(`/teacher/files?${params.toString()}`);
    return res.data.data;
  }

  /**
   * Fetch storage statistics
   */
  async getFileStats(): Promise<FileStats> {
    const res = await api.get<{ data: FileStats }>('/teacher/files/stats');
    return res.data.data;
  }

  /**
   * Fetch file details by ID
   */
  async getFileById(id: string): Promise<FileAsset> {
    const res = await api.get<{ data: FileAsset }>(`/teacher/files/${id}`);
    return res.data.data;
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(id: string, data: UpdateFileMetadataInput): Promise<FileAsset> {
    const res = await api.patch<{ data: FileAsset }>(`/teacher/files/${id}`, data);
    return res.data.data;
  }

  /**
   * Soft delete or permanently delete file
   */
  async deleteFile(id: string, permanent: boolean = false): Promise<void> {
    await api.delete(`/teacher/files/${id}?permanent=${permanent}`);
  }

  /**
   * Restore file from trash
   */
  async restoreFile(id: string): Promise<FileAsset> {
    const res = await api.patch<{ data: FileAsset }>(`/teacher/files/${id}/restore`);
    return res.data.data;
  }

  /**
   * Get secure download URL and track download count
   */
  async getDownloadUrl(id: string): Promise<{ url: string; originalName: string }> {
    const res = await api.get<{ data: { url: string; originalName: string } }>(`/teacher/files/${id}/download`);
    return res.data.data;
  }

  /**
   * Get preview info
   */
  async getPreviewInfo(id: string): Promise<any> {
    const res = await api.get<{ data: any }>(`/teacher/files/${id}/preview`);
    return res.data.data;
  }
}

export const teacherFileService = new TeacherFileService();
export default teacherFileService;
