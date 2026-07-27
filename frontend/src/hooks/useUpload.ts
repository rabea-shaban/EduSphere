import { useState, useCallback } from "react";
import uploadService, { UploadResponse } from "@/services/upload.service";
import { toast } from "react-hot-toast";

export interface UploadOptions {
  category?: "image" | "video" | "document";
  folder?: string;
  maxSizeMB?: number;
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UploadOptions = {}) {
  const { category = "image", folder = "edusphere/uploads", maxSizeMB = 10, onSuccess, onError } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadData, setUploadData] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      // 1. Validation: Max File Size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const errMsg = `حجم الملف يتجاوز الحد المسموح به (${maxSizeMB} ميجابايت)`;
        toast.error(errMsg);
        setError(errMsg);
        return;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        let result: UploadResponse;
        if (category === "video") {
          result = await uploadService.uploadVideo(file, folder, setProgress);
        } else if (category === "document") {
          result = await uploadService.uploadDocument(file, folder, setProgress);
        } else {
          result = await uploadService.uploadImage(file, folder, setProgress);
        }

        setUploadData(result);
        toast.success("تم رفع الملف إلى خوادم Cloudinary بنجاح 🎉");
        if (onSuccess) onSuccess(result);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || "حدث خطأ أثناء رفع الملف";
        toast.error(message);
        setError(message);
        if (onError) onError(err);
      } finally {
        setIsUploading(false);
      }
    },
    [category, folder, maxSizeMB, onSuccess, onError]
  );

  const deleteFile = useCallback(
    async (publicId: string, resourceType: "image" | "video" | "raw" = "image") => {
      try {
        await uploadService.deleteFile(publicId, resourceType);
        setUploadData(null);
        toast.success("تم حذف الملف بنجاح 🗑️");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "تعذر حذف الملف");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setUploadData(null);
    setError(null);
  }, []);

  return {
    uploadFile,
    deleteFile,
    reset,
    isUploading,
    progress,
    uploadData,
    error,
  };
}

export default useUpload;
