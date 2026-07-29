import * as React from "react";
import { X, Copy, Check, Save, Folder, HardDrive, Download, Calendar, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import type { FileAsset, UpdateFileMetadataInput } from "@/features/teacher/types/files";

interface FileDetailsSidebarProps {
  file: FileAsset | null;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateFileMetadataInput) => void;
  isUpdating?: boolean;
}

export function FileDetailsSidebar({ file, onClose, onUpdate, isUpdating }: FileDetailsSidebarProps) {
  const [originalName, setOriginalName] = React.useState("");
  const [folder, setFolder] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (file) {
      setOriginalName(file.originalName);
      setFolder(file.folder);
    }
  }, [file]);

  if (!file) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(file.secureUrl);
    setCopied(true);
    toast.success("تم نسخ رابط الملف المباشر للحافظة");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(file.id, { originalName, folder });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-white dark:bg-[#0F274D] border-r border-slate-200 dark:border-white/10 shadow-2xl p-6 overflow-y-auto space-y-6 text-right animate-in slide-in-from-left duration-200" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#F58220]" />
          تفاصيل وبيانات الملف
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Metadata edit */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">اسم الملف الأصلي</label>
          <input
            type="text"
            value={originalName}
            onChange={(e) => setOriginalName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">تغيير المجلد</label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="general">general (الملفات العامة)</option>
            <option value="courses">courses (وسائط الكورسات)</option>
            <option value="lessons">lessons (ملحقات الدروس)</option>
            <option value="assignments">assignments (الواجبات والتكاليف)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full h-11 rounded-xl bg-[#0B2D5B] hover:bg-[#071C3B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          حفظ التعديلات
        </button>
      </form>

      {/* Details List */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10 text-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-200">الخصائص والمواصفات</h4>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-slate-500">حجم الملف:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatFileSize(file.fileSize)}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-slate-500">الامتداد / MIME:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">{file.extension} / {file.mimeType}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-slate-500">مزود التخزين السحابي:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{file.cloudProvider}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-slate-500">عدد التنزيلات:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{file.downloadCount} مرة</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="text-slate-500">تاريخ الإنشاء:</span>
          <span className="text-slate-600 dark:text-slate-300">{new Date(file.createdAt).toLocaleString("ar-EG")}</span>
        </div>
      </div>

      {/* Copy Public Link Block */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الرابط المباشر للملف</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={file.secureUrl}
            className="w-full h-9 px-3 rounded-lg bg-white dark:bg-[#071C3B] border border-slate-200 dark:border-white/10 text-[10px] font-mono truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-[#F58220] hover:bg-[#e57310] text-white transition-all shadow-sm shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
export default FileDetailsSidebar;

