import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import teacherFileService from "@/services/teacherFile.service";
import type { FileQueryFilters, UpdateFileMetadataInput } from "@/features/teacher/types/files";

export const TEACHER_FILE_KEYS = {
  all: ["teacher-files"] as const,
  list: (filters?: FileQueryFilters) => ["teacher-files", "list", filters] as const,
  detail: (id: string) => ["teacher-files", "detail", id] as const,
  stats: ["teacher-files", "stats"] as const,
};

export function useFiles(filters?: FileQueryFilters) {
  return useQuery({
    queryKey: TEACHER_FILE_KEYS.list(filters),
    queryFn: () => teacherFileService.getFiles(filters),
    staleTime: 1000 * 60 * 3, // 3 minutes
    refetchOnWindowFocus: false,
  });
}

export function useFile(id: string) {
  return useQuery({
    queryKey: TEACHER_FILE_KEYS.detail(id),
    queryFn: () => teacherFileService.getFileById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  });
}

export function useFileStats() {
  return useQuery({
    queryKey: TEACHER_FILE_KEYS.stats,
    queryFn: () => teacherFileService.getFileStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      payload,
      onProgress,
    }: {
      file: File;
      payload?: { folder?: string; entityType?: string; entityId?: string };
      onProgress?: (progress: number) => void;
    }) => teacherFileService.uploadSingleFile(file, payload, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_FILE_KEYS.all });
      toast.success("تم رفع الملف بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر رفع الملف، يرجى المحاولة مرة أخرى");
    },
  });
}

export function useUploadMultipleFiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      payload,
      onProgress,
    }: {
      files: File[];
      payload?: { folder?: string; entityType?: string; entityId?: string };
      onProgress?: (progress: number) => void;
    }) => teacherFileService.uploadMultipleFiles(files, payload, onProgress),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_FILE_KEYS.all });
      toast.success(`تم رفع ${data.length} ملفات بنجاح.`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر رفع مجموعة الملفات");
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFileMetadataInput }) =>
      teacherFileService.updateFileMetadata(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_FILE_KEYS.all });
      toast.success("تم تعديل بيانات الملف بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تعديل بيانات الملف");
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      teacherFileService.deleteFile(id, permanent),
    onSuccess: (_, { permanent }) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_FILE_KEYS.all });
      toast.success(permanent ? "تم حذف الملف نهائياً." : "تم نقل الملف إلى سلة المهملات.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر حذف الملف");
    },
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherFileService.restoreFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_FILE_KEYS.all });
      toast.success("تم استعادة الملف من سلة المهملات بنجاح.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر استعادة الملف");
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: (id: string) => teacherFileService.getDownloadUrl(id),
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.href = data.url;
      link.setAttribute("download", data.originalName);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("جاري تحميل الملف...");
    },
    onError: (error: any) => {
      toast.error(error?.message || "تعذر تحميل الملف");
    },
  });
}
