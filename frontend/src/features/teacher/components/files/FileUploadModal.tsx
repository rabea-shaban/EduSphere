import * as React from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2, FolderPlus, Image as ImageIcon, Trash2 } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], folder: string, onProgress?: (percent: number) => void) => void;
  isUploading?: boolean;
}

export function FileUploadModal({ isOpen, onClose, onUpload, isUploading }: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [folder, setFolder] = React.useState<string>("general");
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setUploadProgress(0);
    }
  }, [isOpen]);

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
    if (selectedFiles.length === 0 || isUploading) return;
    setUploadProgress(10);
    onUpload(selectedFiles, folder, (percent) => {
      setUploadProgress(percent);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">رفع ملفات جديدة للمكتبة</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">اسحب الملفات وأفلتها هنا أو اضغط للتصفح</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Folder Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#F58220]" />
              اختر المجلد المستهدف
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              disabled={isUploading}
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] transition-colors"
            >
              <option value="general">general (الملفات العامة)</option>
              <option value="courses">courses (وسائط الكورسات والدورات)</option>
              <option value="lessons">lessons (ملحقات الدروس والحصص)</option>
              <option value="assignments">assignments (ملفات الواجبات والتكاليف)</option>
            </select>
          </div>

          {/* Drag & Drop Zone */}
          {!isUploading && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#F58220] bg-[#F58220]/10 scale-[0.99]"
                  : "border-slate-300 dark:border-white/20 hover:border-[#F58220] hover:bg-slate-50/80 dark:hover:bg-white/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-[#0B2D5B]/5 dark:bg-white/10 text-[#0B2D5B] dark:text-[#1E73D8] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Upload className="w-7 h-7 text-[#F58220]" />
              </div>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                اضغط هنا لاختيار الملفات أو اسحبها وأفلتها مباشرة
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                يدعم الصور، الفيديوهات، PDF، المستندات، والملفات المضغوطة (حتى 100MB للملف)
              </p>
            </div>
          )}

          {/* Real-time Progress Bar */}
          {isUploading && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#F58220]" />
                  جاري رفع الملفات للسحابة...
                </span>
                <span className="font-mono text-[#F58220]">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#F58220] to-[#FF9A2A] h-full transition-all duration-300 rounded-full shadow-md"
                  style={{ width: `${Math.max(5, uploadProgress)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">يرجى الانتظار حتى اكتمال الرفع والمزامنة</p>
            </div>
          )}

          {/* Selected Files Queue with Thumbnails */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>الملفات المحددة ({selectedFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-rose-500 hover:underline text-[11px]"
                >
                  حذف الكل
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedFiles.map((file, i) => {
                  const isImage = file.type.startsWith("image/");
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#F58220] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="h-11 px-5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={selectedFiles.length === 0 || isUploading}
              className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              بدء رفع {selectedFiles.length > 0 ? `(${selectedFiles.length}) ملف` : ""}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FileUploadModal;

