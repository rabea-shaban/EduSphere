"use client";

import * as React from "react";
import { FolderOpen, HardDrive, Upload, Layers, Trash2, RotateCcw, CheckSquare, Sparkles } from "lucide-react";
import {
  useFiles,
  useFileStats,
  useUploadMultipleFiles,
  useUpdateFile,
  useDeleteFile,
  useRestoreFile,
  useDownloadFile,
} from "@/hooks/useTeacherFiles";
import dynamic from "next/dynamic";
import type { FileAsset, FileCategory } from "@/features/teacher/types/files";
import { FileManagerHeader } from "@/features/teacher/components/files/FileManagerHeader";
import { FileGridCard } from "@/features/teacher/components/files/FileGridCard";
import { FileTableView } from "@/features/teacher/components/files/FileTableView";
import { FilesSkeleton } from "@/features/teacher/components/files/FilesSkeleton";
import { FilesEmptyState } from "@/features/teacher/components/files/FilesEmptyState";
import { toast } from "react-hot-toast";

const FileUploadModal = dynamic(() => import("@/features/teacher/components/files/FileUploadModal").then((mod) => mod.FileUploadModal), { ssr: false });
const FilePreviewModal = dynamic(() => import("@/features/teacher/components/files/FilePreviewModal").then((mod) => mod.FilePreviewModal), { ssr: false });
const FileDetailsSidebar = dynamic(() => import("@/features/teacher/components/files/FileDetailsSidebar").then((mod) => mod.FileDetailsSidebar), { ssr: false });

export default function TeacherFileManagerPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<FileCategory>("all");
  const [folder, setFolder] = React.useState<string>("");
  const [sort, setSort] = React.useState<any>("newest");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [isTrashActive, setIsTrashActive] = React.useState(false);
  const [page, setPage] = React.useState(1);

  // Drag overlay state
  const [isDraggingPage, setIsDraggingPage] = React.useState(false);

  // Multi-select state
  const [selectedFileIds, setSelectedFileIds] = React.useState<string[]>([]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<FileAsset | null>(null);
  const [selectedFileForSidebar, setSelectedFileForSidebar] = React.useState<FileAsset | null>(null);

  // Queries & Mutations
  const { data: filesData, isLoading, isError, refetch } = useFiles({
    page,
    limit: 24,
    search,
    category: isTrashActive ? undefined : category,
    folder: isTrashActive ? undefined : folder || undefined,
    sort,
    deleted: isTrashActive,
  });

  const { data: stats } = useFileStats();
  const uploadMultiple = useUploadMultipleFiles();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();
  const restoreFile = useRestoreFile();
  const downloadFile = useDownloadFile();

  const files = filesData?.files || [];
  const pagination = filesData?.pagination;

  // Clear selection when changing page / filters
  React.useEffect(() => {
    setSelectedFileIds([]);
  }, [page, category, folder, isTrashActive, search]);

  // Page level Drag & Drop handlers
  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingPage) setIsDraggingPage(true);
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingPage(false);
  };

  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsUploadOpen(true);
    }
  };

  const handleUploadSubmit = (uploadFiles: File[], targetFolder: string, onProgress?: (percent: number) => void) => {
    uploadMultiple.mutate(
      { files: uploadFiles, payload: { folder: targetFolder }, onProgress },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
        },
      }
    );
  };

  // Multi select handlers
  const toggleSelectFile = (file: FileAsset) => {
    setSelectedFileIds((prev) =>
      prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === files.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map((f) => f.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedFileIds.length === 0) return;
    const isPermanent = isTrashActive;
    if (
      confirm(
        isPermanent
          ? `هل أنت أكتد من حذف ${selectedFileIds.length} ملف نهائياً؟`
          : `هل تريد نقل ${selectedFileIds.length} ملف إلى سلة المهملات؟`
      )
    ) {
      let completed = 0;
      selectedFileIds.forEach((id) => {
        deleteFile.mutate(
          { id, permanent: isPermanent },
          {
            onSuccess: () => {
              completed += 1;
              if (completed === selectedFileIds.length) {
                setSelectedFileIds([]);
              }
            },
          }
        );
      });
    }
  };

  const handleBulkRestore = () => {
    if (selectedFileIds.length === 0) return;
    let completed = 0;
    selectedFileIds.forEach((id) => {
      restoreFile.mutate(id, {
        onSuccess: () => {
          completed += 1;
          if (completed === selectedFileIds.length) {
            setSelectedFileIds([]);
          }
        },
      });
    });
  };

  return (
    <div
      onDragOver={handlePageDragOver}
      onDragLeave={handlePageDragLeave}
      onDrop={handlePageDrop}
      className="relative min-h-screen space-y-8 text-right pb-12"
      dir="rtl"
    >
      {/* Page Full Drag Overlay */}
      {isDraggingPage && (
        <div className="fixed inset-0 z-50 bg-[#0B2D5B]/80 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-[#F58220] p-8 animate-in fade-in duration-150 pointer-events-none">
          <Upload className="w-16 h-16 text-[#F58220] animate-bounce mb-4" />
          <h2 className="text-2xl font-black">أفلت الملفات هنا للرفع المباشر</h2>
          <p className="text-sm text-slate-200 mt-2">سيتم فتح نافذة الرفع مع الملفات التي قمت بإسقاطها</p>
        </div>
      )}

      {/* Top Title Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-[#F58220]" />
            مكتبة الملفات والوسائط التعليمية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إدارة، تنظيف، ورفع الصور والمستندات والفيديوهات وتنسيق المجلدات بسهولة وسرعة
          </p>
        </div>

        {/* Stats & Storage Usage Bar */}
        {stats && (
          <div className="w-full lg:w-auto bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 p-4 rounded-3xl shadow-sm space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-6 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <HardDrive className="w-4 h-4" />
                المساحة المستخدمة: {stats.totalStorageMB} MB
              </span>
              <span className="text-slate-400 font-normal">
                إجمالي الملفات: <strong className="text-slate-900 dark:text-white font-mono">{stats.totalFiles}</strong>
              </span>
            </div>

            {/* Storage Visualizer Bar */}
            <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#F58220] h-full"
                style={{ width: `${Math.min(100, Math.max(5, (parseFloat(stats.totalStorageMB) / 5000) * 100))}%` }}
                title="تخزين الملفات"
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Header Search & Controls */}
      <FileManagerHeader
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={(cat) => {
          setCategory(cat);
          setPage(1);
        }}
        folder={folder}
        onFolderChange={(f) => {
          setFolder(f);
          setPage(1);
        }}
        isTrashActive={isTrashActive}
        onTrashToggle={() => {
          setIsTrashActive((prev) => !prev);
          setPage(1);
        }}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadClick={() => setIsUploadOpen(true)}
        selectedCount={selectedFileIds.length}
        onSelectAllToggle={handleSelectAll}
        isAllSelected={selectedFileIds.length > 0 && selectedFileIds.length === files.length}
        onBulkDelete={handleBulkDelete}
        onBulkRestore={handleBulkRestore}
        onClearSelection={() => setSelectedFileIds([])}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <FilesSkeleton />
      ) : isError ? (
        <FilesEmptyState
          title="تعذر تحميل قائمة الملفات"
          description="حدث خطأ في الاتصال بالخادم. يرجى إعادة المحاولة."
          onUploadClick={() => refetch()}
        />
      ) : files.length === 0 ? (
        <FilesEmptyState
          title={isTrashActive ? "سلة المهملات فارغة" : "لا توجد ملفات متطابقة مع البحث"}
          description={
            isTrashActive
              ? "لا توجد ملفات محذوفة مؤقتاً في سلة المهملات حالياً."
              : "لم يتم العثور على أي ملفات مطابقة للفئة أو المجلد أو نتائج البحث المحددة."
          }
          onUploadClick={isTrashActive ? undefined : () => setIsUploadOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {files.map((file) => (
                <FileGridCard
                  key={file.id}
                  file={file}
                  isSelected={selectedFileIds.includes(file.id)}
                  onSelectToggle={toggleSelectFile}
                  onPreview={(f) => setPreviewFile(f)}
                  onDownload={(f) => downloadFile.mutate(f.id)}
                  onRename={(f) => setSelectedFileForSidebar(f)}
                  onDelete={(f, permanent) => deleteFile.mutate({ id: f.id, permanent })}
                  onRestore={(f) => restoreFile.mutate(f.id)}
                />
              ))}
            </div>
          ) : (
            <FileTableView
              files={files}
              selectedFileIds={selectedFileIds}
              onSelectToggle={toggleSelectFile}
              onSelectAllToggle={handleSelectAll}
              isAllSelected={selectedFileIds.length > 0 && selectedFileIds.length === files.length}
              onPreview={(f) => setPreviewFile(f)}
              onDownload={(f) => downloadFile.mutate(f.id)}
              onRename={(f) => setSelectedFileForSidebar(f)}
              onDelete={(f, permanent) => deleteFile.mutate({ id: f.id, permanent })}
              onRestore={(f) => restoreFile.mutate(f.id)}
            />
          )}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 dark:border-white/10 text-xs font-bold">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                السابق
              </button>
              <span className="px-3 py-2 text-slate-500">
                صفحة {page} من {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadSubmit}
        isUploading={uploadMultiple.isPending}
      />

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={(f) => downloadFile.mutate(f.id)}
      />

      {/* Details Sidebar */}
      <FileDetailsSidebar
        file={selectedFileForSidebar}
        onClose={() => setSelectedFileForSidebar(null)}
        onUpdate={(id, data) =>
          updateFile.mutate(
            { id, data },
            {
              onSuccess: () => setSelectedFileForSidebar(null),
            }
          )
        }
        isUpdating={updateFile.isPending}
      />
    </div>
  );
}

