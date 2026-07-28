import * as React from "react";
import { Download, Eye, Edit2, Trash2, RotateCcw, FileText, Image as ImageIcon, Video, Archive, Music, Code, File } from "lucide-react";
import type { FileAsset } from "@/features/teacher/types/files";

interface FileTableViewProps {
  files: FileAsset[];
  onPreview: (file: FileAsset) => void;
  onDownload: (file: FileAsset) => void;
  onRename: (file: FileAsset) => void;
  onDelete: (file: FileAsset, permanent?: boolean) => void;
  onRestore?: (file: FileAsset) => void;
}

export function FileTableView({ files, onPreview, onDownload, onRename, onDelete, onRestore }: FileTableViewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-500" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "archive":
        return <Archive className="w-4 h-4 text-amber-500" />;
      case "audio":
        return <Music className="w-4 h-4 text-rose-500" />;
      case "code":
        return <Code className="w-4 h-4 text-cyan-500" />;
      default:
        return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden text-right" dir="rtl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold">
              <th className="py-3.5 px-4 text-right">اسم الملف</th>
              <th className="py-3.5 px-4 text-right">الفئة</th>
              <th className="py-3.5 px-4 text-right">الحجم</th>
              <th className="py-3.5 px-4 text-right">المجلد</th>
              <th className="py-3.5 px-4 text-right">تاريخ الرفع</th>
              <th className="py-3.5 px-4 text-center">التحميلات</th>
              <th className="py-3.5 px-4 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold text-slate-700 dark:text-slate-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPreview(file)}>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                      {getCategoryIcon(file.category)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs hover:text-[#F58220] transition-colors">
                        {file.originalName}
                      </p>
                      <span className="uppercase text-[10px] text-slate-400">{file.extension}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 capitalize">{file.category}</td>

                <td className="py-3 px-4 font-mono">{formatFileSize(file.fileSize)}</td>

                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {file.folder}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-400 text-[11px]">
                  {new Date(file.createdAt).toLocaleDateString("ar-EG")}
                </td>

                <td className="py-3 px-4 text-center font-bold text-slate-500">{file.downloadCount}</td>

                <td className="py-3 px-4 text-left">
                  <div className="flex items-center justify-end gap-1">
                    {!file.isDeleted ? (
                      <>
                        <button
                          onClick={() => onPreview(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDownload(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                          title="تحميل"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRename(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#F58220] hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                          title="تعديل الاسم"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(file, false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        {onRestore && (
                          <button
                            onClick={() => onRestore(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                            title="استعادة"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(file, true)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="حذف نهائي"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default FileTableView;
