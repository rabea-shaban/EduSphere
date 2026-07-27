"use client";

import * as React from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  Trash2,
  Eye,
  File,
  AlertCircle,
} from "lucide-react";
import { useUpload, UploadOptions } from "@/hooks/useUpload";
import { cn } from "@/lib/utils";

export interface FileUploaderProps extends UploadOptions {
  value?: string;
  onChange?: (url: string, publicId?: string) => void;
  label?: string;
  helperText?: string;
  accept?: string;
  className?: string;
}

export function FileUploader({
  value,
  onChange,
  label = "رفع ملف جديد",
  helperText = "اسحب الملف إلى هنا أو انقر للاختيار",
  category = "image",
  folder,
  maxSizeMB = 10,
  accept,
  className,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { uploadFile, deleteFile, isUploading, progress, uploadData, error, reset } = useUpload({
    category,
    folder,
    maxSizeMB,
    onSuccess: (data) => {
      if (onChange) onChange(data.url, data.publicId);
    },
  });

  const previewUrl = uploadData?.url || value;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleRemove = async () => {
    if (uploadData?.publicId) {
      await deleteFile(
        uploadData.publicId,
        category === "video" ? "video" : category === "document" ? "raw" : "image"
      );
    }
    reset();
    if (onChange) onChange("");
  };

  return (
    <div className={cn("space-y-2 text-right dir-rtl", className)}>
      {label && <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{label}</label>}

      {/* Dropzone Container */}
      {!previewUrl && !isUploading ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 flex flex-col items-center justify-center min-h-[160px]",
            dragActive
              ? "border-[#F58220] bg-[#F58220]/5 scale-[1.01]"
              : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:border-[#1E73D8] hover:bg-slate-100/50 dark:hover:bg-white/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || (category === "image" ? "image/*" : category === "video" ? "video/*" : ".pdf,.docx,.zip")}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="h-12 w-12 rounded-2xl bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center">
            {category === "video" ? (
              <Video className="h-6 w-6" />
            ) : category === "document" ? (
              <FileText className="h-6 w-6" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-black text-[#0B2D5B] dark:text-white">{helperText}</p>
            <p className="text-[11px] text-slate-400 font-semibold">
              الحد الأقصى للحجم: <strong className="text-[#F58220]">{maxSizeMB} MB</strong>
            </p>
          </div>
        </div>
      ) : null}

      {/* Uploading State with Progress Bar */}
      {isUploading && (
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#0B2D5B] dark:text-white">
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[#F58220]" />
              <span>جاري رفع الملف إلى خوادم Cloudinary...</span>
            </span>
            <span className="font-mono font-black text-[#F58220]">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#F58220] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Preview State */}
      {previewUrl && !isUploading && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {category === "image" ? (
              <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0 border border-slate-200 dark:border-white/20">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                {category === "video" ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
              </div>
            )}

            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-1.5 truncate">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">{uploadData?.originalName || "تم رفع الملف بجمالية"}</span>
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#1E73D8] hover:underline truncate block"
              >
                معاينة الرابط المباشر 🔗
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
              title="حذف الملف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default FileUploader;
