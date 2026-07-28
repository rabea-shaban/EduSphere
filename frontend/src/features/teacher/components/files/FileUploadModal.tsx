import * as React from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2, FolderPlus } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], folder: string) => void;
  isUploading?: boolean;
}

export function FileUploadModal({ isOpen, onClose, onUpload, isUploading }: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [folder, setFolder] = React.useState<string>("general");
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    onUpload(selectedFiles, folder);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">رفع ملفات جديدة إلى المكتبة</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">اسحب الملفات وأفلتها هنا أو اضغط للاختيار من جهازك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Folder Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#F58220]" />
              تحديد المجلد المستهدف (Target Folder)
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            >
              <option value="general">الملفات العامة (General Files)</option>
              <option value="courses">وسائط الدورات الكورسات (Course Media)</option>
              <option value="lessons">ملحقات الدروس (Lesson Resources)</option>
              <option value="assignments">ملفات الواجبات والتكاليف (Assignments)</option>
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-[#F58220] bg-[#F58220]/5 scale-[0.99]"
                : "border-slate-300 dark:border-white/20 hover:border-[#F58220] hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-[#0B2D5B]/5 dark:bg-white/10 text-[#0B2D5B] dark:text-[#1E73D8] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              اضغط هنا لاختيار الملفات أو اسحبها وأفلتها مباشرة
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              يدعم الصور، الفيديوهات، PDF، المستندات، والملفات المضغوطة ZIP (حتى 100MB)
            </p>
          </div>

          {/* Selected Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                الملفات المحددة ({selectedFiles.length})
              </span>
              <div className="space-y-2">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-4 h-4 text-[#F58220] shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={selectedFiles.length === 0 || isUploading}
              className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              بدء رفع الملفات ({selectedFiles.length})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FileUploadModal;
