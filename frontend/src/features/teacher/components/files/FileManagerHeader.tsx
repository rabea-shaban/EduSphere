import * as React from "react";
import { Search, Filter, Grid, List, Upload, Image, Video, FileText, Archive, Music, Code, Trash2, ArrowUpDown } from "lucide-react";
import type { FileCategory } from "@/features/teacher/types/files";

interface FileManagerHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: FileCategory;
  onCategoryChange: (cat: FileCategory) => void;
  isTrashActive: boolean;
  onTrashToggle: () => void;
  sort: string;
  onSortChange: (sort: any) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onUploadClick: () => void;
}

const CATEGORIES: { id: FileCategory; label: string; icon: any }[] = [
  { id: "all", label: "كافة الملفات", icon: Filter },
  { id: "image", label: "الصور", icon: Image },
  { id: "video", label: "الفيديوهات", icon: Video },
  { id: "document", label: "المستندات و PDF", icon: FileText },
  { id: "archive", label: "الملفات المضغوطة", icon: Archive },
  { id: "audio", label: "الملفات الصوتية", icon: Music },
  { id: "code", label: "الأكواد والبرمجة", icon: Code },
];

export function FileManagerHeader({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  isTrashActive,
  onTrashToggle,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
}: FileManagerHeaderProps) {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Top action row */}
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

        <div className="flex items-center gap-3">
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
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "table"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            رفع ملفات
          </button>
        </div>
      </div>

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
