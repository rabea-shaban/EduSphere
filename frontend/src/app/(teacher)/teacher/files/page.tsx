"use client";

import * as React from "react";
import { FolderOpen, HardDrive, Image as ImageIcon, Video, FileText, Upload } from "lucide-react";
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

const FileUploadModal = dynamic(() => import("@/features/teacher/components/files/FileUploadModal").then((mod) => mod.FileUploadModal), { ssr: false });
const FilePreviewModal = dynamic(() => import("@/features/teacher/components/files/FilePreviewModal").then((mod) => mod.FilePreviewModal), { ssr: false });
const FileDetailsSidebar = dynamic(() => import("@/features/teacher/components/files/FileDetailsSidebar").then((mod) => mod.FileDetailsSidebar), { ssr: false });

export default function TeacherFileManagerPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<FileCategory>("all");
  const [sort, setSort] = React.useState<any>("newest");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [isTrashActive, setIsTrashActive] = React.useState(false);
  const [page, setPage] = React.useState(1);

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
    sort,
    deleted: isTrashActive,
  });

  const { data: stats } = useFileStats();
  const uploadMultiple = useUploadMultipleFiles();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();
  const restoreFile = useRestoreFile();
  const downloadFile = useDownloadFile();

  const handleUploadSubmit = (files: File[], folder: string) => {
    uploadMultiple.mutate(
      { files, payload: { folder } },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
        },
      }
    );
  };

  const files = filesData?.files || [];
  const pagination = filesData?.pagination;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-[#F58220]" />
            مكتبة الملفات والوسائط (Media Library) 📁
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            رفع، تنظيم، ومعاينة الصور والفيديوهات والمستندات التعليمية وحفظها في التخزين السحابي
          </p>
        </div>

        {/* Stats Quick Badges */}
        {stats && (
          <div className="flex items-center gap-3 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-4 h-4" />
              المساحة المستغلة: {stats.totalStorageMB} MB
            </span>
            <span className="text-slate-300 dark:text-white/10">|</span>
            <span>إجمالي الملفات: {stats.totalFiles}</span>
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
              : "لم يتم العثور على أي ملفات مطابقة للفئة أو نتائج البحث المحددة."
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
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                السابق
              </button>
              <span className="px-3 py-2 text-slate-500">
                صفحة {page} من {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 disabled:opacity-40"
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
