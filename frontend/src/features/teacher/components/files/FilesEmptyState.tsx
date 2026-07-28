import * as React from "react";
import { FolderOpen, Upload } from "lucide-react";

interface FilesEmptyStateProps {
  title?: string;
  description?: string;
  onUploadClick?: () => void;
}

export function FilesEmptyState({
  title = "لا توجد ملفات في المكتبة",
  description = "لم تقم برفع أي ملفات أو مستندات حتى الآن. قم ببدء رفع الملفات لإدارتها ومشاركتها مع طلابك.",
  onUploadClick,
}: FilesEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center mx-auto">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#0B2D5B] dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{description}</p>
      {onUploadClick && (
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          رفع ملف جديد الآن
        </button>
      )}
    </div>
  );
}
export default FilesEmptyState;
