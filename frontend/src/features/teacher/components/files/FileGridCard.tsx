import * as React from "react";
import { Image as ImageIcon, Video, FileText, Archive, Music, Code, File, Download, Eye, MoreVertical, Trash2, RotateCcw, Edit2, Folder } from "lucide-react";
import type { FileAsset } from "@/features/teacher/types/files";

interface FileGridCardProps {
  file: FileAsset;
  onPreview: (file: FileAsset) => void;
  onDownload: (file: FileAsset) => void;
  onRename: (file: FileAsset) => void;
  onDelete: (file: FileAsset, permanent?: boolean) => void;
  onRestore?: (file: FileAsset) => void;
}

export function FileGridCard({ file, onPreview, onDownload, onRename, onDelete, onRestore }: FileGridCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const getCategoryIcon = () => {
    switch (file.category) {
      case "image":
        return <ImageIcon className="w-8 h-8 text-emerald-500" />;
      case "video":
        return <Video className="w-8 h-8 text-purple-500" />;
      case "document":
        return <FileText className="w-8 h-8 text-blue-500" />;
      case "archive":
        return <Archive className="w-8 h-8 text-amber-500" />;
      case "audio":
        return <Music className="w-8 h-8 text-rose-500" />;
      case "code":
        return <Code className="w-8 h-8 text-cyan-500" />;
      default:
        return <File className="w-8 h-8 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="group relative bg-white dark:bg-[#0F274D] rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between" dir="rtl">
      {/* Top Media Preview Container */}
      <div
        onClick={() => onPreview(file)}
        className="relative h-32 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors mb-3"
      >
        {file.category === "image" && file.secureUrl ? (
          <img src={file.secureUrl} alt={file.originalName} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            {getCategoryIcon()}
            <span className="uppercase text-[10px] font-black text-slate-400 mt-1">{file.extension}</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
            className="p-2.5 rounded-xl bg-white/90 text-slate-900 hover:bg-white transition-transform active:scale-95 shadow-md"
            title="معاينة"
          >
            <Eye className="w-4 h-4" />
          </button>

          {!file.isDeleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file);
              }}
              className="p-2.5 rounded-xl bg-[#F58220] text-white hover:bg-[#e57310] transition-transform active:scale-95 shadow-md"
              title="تحميل"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Extension Badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase">
          {file.extension}
        </span>
      </div>

      {/* Info & Actions Header */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1" title={file.originalName}>
            {file.originalName}
          </h4>

          {/* Context Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                onMouseLeave={() => setShowMenu(false)}
                className="absolute left-0 mt-1 w-36 bg-white dark:bg-[#0F274D] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl py-1 z-30 space-y-0.5 text-xs font-bold"
              >
                {!file.isDeleted ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onPreview(file);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      معاينة
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDownload(file);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      تحميل
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRename(file);
                      }}
                      className="w-full px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      إعادة تسمية
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(file, false);
                      }}
                      className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      نقل للقمامة
                    </button>
                  </>
                ) : (
                  <>
                    {onRestore && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onRestore(file);
                        }}
                        className="w-full px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        استعادة
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(file, true);
                      }}
                      className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف نهائي
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* File Meta footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-white/5">
          <span>{formatFileSize(file.fileSize)}</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Folder className="w-3 h-3" />
            {file.folder}
          </span>
        </div>
      </div>
    </div>
  );
}
export default FileGridCard;
