import * as React from "react";
import { Search, Filter, Grid, List, Upload, Image, Video, FileText, Archive, Music, Code, Trash2, ArrowUpDown, Folder, CheckSquare, RotateCcw, XCircle } from "lucide-react";
import type { FileCategory } from "@/features/teacher/types/files";

interface FileManagerHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: FileCategory;
  onCategoryChange: (cat: FileCategory) => void;
  folder: string;
  onFolderChange: (folder: string) => void;
  isTrashActive: boolean;
  onTrashToggle: () => void;
  sort: string;
  onSortChange: (sort: any) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onUploadClick: () => void;
  selectedCount?: number;
  onSelectAllToggle?: () => void;
  isAllSelected?: boolean;
  onBulkDelete?: () => void;
  onBulkRestore?: () => void;
  onClearSelection?: () => void;
}

const CATEGORIES: { id: FileCategory; label: string; icon: any }[] = [
  { id: "all", label: "كافة الفئات", icon: Filter },
  { id: "image", label: "الصور", icon: Image },
  { id: "video", label: "الفيديوهات", icon: Video },
  { id: "document", label: "المستندات و PDF", icon: FileText },
  { id: "archive", label: "الملفات المضغوطة", icon: Archive },
  { id: "audio", label: "الملفات الصوتية", icon: Music },
  { id: "code", label: "الأكواد والبرمجة", icon: Code },
];

const FOLDERS = [
  { id: "", label: "كافة المجلدات" },
  { id: "general", label: "عام (General)" },
  { id: "courses", label: "وسائط الكورسات" },
  { id: "lessons", label: "ملحقات الدروس" },
  { id: "assignments", label: "الواجبات والتكاليف" },
];

export function FileManagerHeader({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  folder,
  onFolderChange,
  isTrashActive,
  onTrashToggle,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
  selectedCount = 0,
  onSelectAllToggle,
  isAllSelected = false,
  onBulkDelete,
  onBulkRestore,
  onClearSelection,
}: FileManagerHeaderProps) {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Bulk Action Toolbar if items selected */}
      {selectedCount > 0 ? (
        <div className="bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-xl text-xs font-black">
              تم تحديد {selectedCount} ملف
            </span>
            {onSelectAllToggle && (
              <button
                onClick={onSelectAllToggle}
                className="text-xs font-bold hover:underline flex items-center gap-1 text-slate-200"
              >
                <CheckSquare className="w-4 h-4" />
                {isAllSelected ? "إلغاء تحديد الكل" : "تحديد كافة الصفحة"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isTrashActive ? (
              onBulkDelete && (
                <button
                  onClick={onBulkDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  نقل للقمامة ({selectedCount})
                </button>
              )
            ) : (
              <>
                {onBulkRestore && (
                  <button
                    onClick={onBulkRestore}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    استعادة ({selectedCount})
                  </button>
                )}
                {onBulkDelete && (
                  <button
                    onClick={onBulkDelete}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف نهائي ({selectedCount})
                  </button>
                )}
              </>
            )}

            {onClearSelection && (
              <button
                onClick={onClearSelection}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="إلغاء التحديد"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Top action row */
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث باسم الملف أو الامتداد..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-11 pr-11 pl-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Folder Dropdown Filter */}
            <div className="relative flex items-center gap-2 bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 px-3 h-11 rounded-2xl">
              <Folder className="w-4 h-4 text-[#F58220]" />
              <select
                value={folder}
                onChange={(e) => onFolderChange(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {FOLDERS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 px-3 h-11 rounded-2xl">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
                <option value="largest">الأكبر حجماً</option>
                <option value="smallest">الأصغر حجماً</option>
                <option value="name">حسب الاسم (أ-ي)</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 rounded-2xl p-1">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("table")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "table"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={onUploadClick}
              className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              رفع ملفات جديدة
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs & Trash */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = !isTrashActive && category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isTrashActive) onTrashToggle();
                onCategoryChange(cat.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                  : "bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}

        {/* Trash Tab */}
        <button
          onClick={onTrashToggle}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            isTrashActive
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          سلة المهملات
        </button>
      </div>
    </div>
  );
}
export default FileManagerHeader;

