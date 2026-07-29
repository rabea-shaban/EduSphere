import * as React from "react";
import { X, Download, FileText, ExternalLink, Calendar, HardDrive, Eye, Folder, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import type { FileAsset } from "@/features/teacher/types/files";

interface FilePreviewModalProps {
  file: FileAsset | null;
  onClose: () => void;
  onDownload: (file: FileAsset) => void;
}

export function FilePreviewModal({ file, onClose, onDownload }: FilePreviewModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.secureUrl);
    setCopied(true);
    toast.success("تم نسخ رابط الملف المباشر");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-2xl bg-[#0B2D5B]/5 dark:bg-white/10 text-[#0B2D5B] dark:text-[#1E73D8]">
              <Eye className="w-5 h-5 text-[#F58220]" />
            </div>
            <div className="truncate text-right">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {file.originalName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(file.fileSize)} • {file.mimeType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              نسخ الرابط
            </button>
            <button
              onClick={() => onDownload(file)}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              تحميل
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-slate-900/5 dark:bg-black/20 min-h-[300px]">
          {file.category === "image" ? (
            <img
              src={file.secureUrl}
              alt={file.originalName}
              className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-md"
            />
          ) : file.category === "video" ? (
            <video controls autoPlay className="max-h-[60vh] max-w-full rounded-2xl shadow-md">
              <source src={file.secureUrl} type={file.mimeType} />
              متصفحك لا يدعم مشغل الفيديو المدمج.
            </video>
          ) : file.category === "audio" ? (
            <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#071C3B] shadow-lg text-center space-y-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{file.originalName}</p>
              <audio controls autoPlay className="w-full">
                <source src={file.secureUrl} type={file.mimeType} />
              </audio>
            </div>
          ) : file.mimeType.includes("pdf") ? (
            <iframe
              src={file.secureUrl}
              className="w-full h-[60vh] rounded-2xl border border-slate-200 dark:border-white/10"
              title={file.originalName}
            ></iframe>
          ) : (
            <div className="text-center p-12 space-y-4">
              <FileText className="w-16 h-16 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                المعاينة المباشرة غير متاحة لهذا النوع من الملفات ({file.extension.toUpperCase()})
              </p>
              <button
                onClick={() => onDownload(file)}
                className="h-10 px-6 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md"
              >
                تنزيل الملف لعرض المحتوى
              </button>
            </div>
          )}
        </div>

        {/* Footer Meta Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-[#F58220]" />
              المجلد: {file.folder}
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-slate-400" />
              التخزين: {file.cloudProvider.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              تاريخ الرفع: {new Date(file.createdAt).toLocaleDateString("ar-EG")}
            </span>
          </div>

          <a
            href={file.secureUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#F58220] hover:underline flex items-center gap-1"
          >
            فتح الرابط المباشر <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
export default FilePreviewModal;

