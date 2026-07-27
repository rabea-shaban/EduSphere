"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  CheckCircle2,
  FileEdit,
  Clock,
  Layers,
  Send,
  BookOpen,
  XCircle,
  Bold,
  Italic,
  Underline,
  Heading2,
  Quote,
  Image as ImageIcon,
  Video as VideoIcon,
  PenTool,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminBlogService, { BlogPostItem } from "@/services/adminBlog.service";
import { Button } from "@/components/ui/button";

export default function AdminBlogCMSPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | "Published" | "Draft">("");

  // Modals
  const [writeModalOpen, setWriteModalOpen] = React.useState(false);
  const [viewBlogModal, setViewBlogModal] = React.useState<BlogPostItem | null>(null);

  // New Article Form
  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<"Published" | "Draft">("Published");

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Formatting helper for modal
  const insertFormatting = (startTag: string, endTag: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + `${startTag}نص مخصص${endTag}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "نص مخصص";
    const replacement = `${startTag}${selectedText}${endTag}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 50);
  };

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Blogs
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "blogs", page, debouncedSearch, statusFilter],
    queryFn: () =>
      adminBlogService.getBlogs({
        page,
        limit: 12,
        search: debouncedSearch,
        status: statusFilter || undefined,
      }),
  });

  const blogs = data?.blogs || [];
  const pagination = data?.pagination;

  // Counts for KPI Header
  const totalCount = pagination?.total || 0;
  const publishedCount = blogs.filter((b) => b.status === "Published").length;
  const draftCount = blogs.filter((b) => b.status === "Draft").length;

  // Create Blog Mutation
  const createMutation = useMutation({
    mutationFn: (newBlog: any) => adminBlogService.createBlog(newBlog),
    onSuccess: (_, vars) => {
      toast.success(vars.status === "Draft" ? "تم حفظ المسودة بنجاح" : "تم نشر المقال بنجاح");
      setWriteModalOpen(false);
      setTitle("");
      setExcerpt("");
      setContent("");
      setStatus("Published");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ المقال.");
    },
  });

  // Toggle Status Mutation (Draft <-> Published)
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: "Draft" | "Published" }) =>
      adminBlogService.updateBlog(id, { status: newStatus }),
    onSuccess: (_, vars) => {
      toast.success(vars.newStatus === "Published" ? "تم نشر المقال بنجاح" : "تم تحويل المقال إلى مسودة");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تغيير حالة المقال.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminBlogService.deleteBlog(id),
    onSuccess: () => {
      toast.success("تم حذف العنصر بنجاح");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر حذف العنصر.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <BookOpen className="h-4 w-4" />
            <span>نظام إدارة المقالات والمدونة</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            إدارة النشر والمسودات المقالية
          </h1>
          <p className="text-xs text-slate-500">
            تحرير ونشر المقالات والأبحاث التعليمية وإدارة المسودات وتحديد حالات العرض بالموقع.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Full Editor Page Button */}
          <Link href="/admin/blog/editor">
            <Button className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5 shadow-sm">
              <PenTool className="h-4 w-4" />
              <span>المحرر المتقدم</span>
            </Button>
          </Link>

          <Button
            onClick={() => setWriteModalOpen(true)}
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة مقال سريع</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards & Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter("")}
          className={`p-5 rounded-3xl border shadow-sm space-y-1 cursor-pointer transition-all ${
            statusFilter === ""
              ? "bg-[#0B2D5B] text-white border-[#0B2D5B]"
              : "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10"
          }`}
        >
          <span className="text-xs font-bold opacity-80">إجمالي المقالات والمسودات</span>
          <div className="text-2xl font-black">{totalCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("Published")}
          className={`p-5 rounded-3xl border shadow-sm space-y-1 cursor-pointer transition-all ${
            statusFilter === "Published"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10"
          }`}
        >
          <span className="text-xs font-bold opacity-80">المقالات المنشورة</span>
          <div className="text-2xl font-black">{publishedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("Draft")}
          className={`p-5 rounded-3xl border shadow-sm space-y-1 cursor-pointer transition-all ${
            statusFilter === "Draft"
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white dark:bg-[#0F274D] border-slate-200/80 dark:border-white/10"
          }`}
        >
          <span className="text-xs font-bold opacity-80">المسودات الحالية</span>
          <div className="text-2xl font-black">{draftCount}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم المقال أو الكاتب..."
            className="w-full h-10 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">
              لا توجد سجلات مطابقة لمعايير البحث
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-[#0B2D5B] dark:text-white text-sm line-clamp-1">
                      {b.title}
                    </h3>
                    {b.status === "Published" ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        منشور
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                        مسودة
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {b.excerpt || b.content.replace(/<[^>]*>?/gm, "").slice(0, 120)}...
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <span>الكاتب: {b.authorId?.firstName ? `${b.authorId.firstName} ${b.authorId.lastName}` : "المشرف العام"}</span>
                    <span>المشاهدات: {b.views || 0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => setViewBlogModal(b)}
                      className="px-3 py-1.5 rounded-xl bg-[#0B2D5B] text-white font-bold hover:bg-[#1E73D8] transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>معاينة</span>
                    </button>

                    {/* Toggle Status (Publish or Draft) */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          id: b._id,
                          newStatus: b.status === "Published" ? "Draft" : "Published",
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 font-bold hover:bg-slate-300 transition-colors"
                    >
                      {b.status === "Published" ? "تحويل إلى مسودة" : "نشر المقال"}
                    </button>
                  </div>

                  {/* Delete Draft/Article */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنت متاكد من حذف المقال "${b.title}"؟`)) {
                        deleteMutation.mutate(b._id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                    title="حذف العنصر"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: WRITE NEW ARTICLE WITH TOOLBAR */}
      <AnimatePresence>
        {writeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right max-h-[85vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                  إنشاء مقال جديد
                </h3>
                <Link href="/admin/blog/editor" onClick={() => setWriteModalOpen(false)}>
                  <span className="text-xs font-bold text-[#F58220] hover:underline">
                    فتح المحرر المتقدم
                  </span>
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">عنوان المقال *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="أدخل عنوان المقال..."
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الملخص التنفيذي</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="ملخص موجز يظهر في القوائم..."
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* RICH TEXT TOOLBAR */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">المحتوى والتنسيق *</label>
                  <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex flex-wrap gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting("<b>", "</b>")}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 font-black"
                        title="خط عريض"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<i>", "</i>")}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200"
                        title="خط مائل"
                      >
                        <Italic className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<h2 className='text-xl font-bold text-[#0B2D5B] my-2'>", "</h2>")}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 text-[#0B2D5B]"
                        title="عنوان فرعي"
                      >
                        <Heading2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<blockquote className='p-3 border-r-4 border-[#F58220] bg-slate-50 rounded-xl my-2'>", "</blockquote>")}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 text-[#F58220]"
                        title="اقتباس"
                      >
                        <Quote className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("رابط الصورة:");
                          if (url) insertFormatting(`<img src="${url}" className="w-full rounded-2xl my-3" />`);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 text-purple-600"
                        title="إضافة صورة"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const v = prompt("رابط الوسائط المضمنة:");
                          if (v) insertFormatting(`<iframe src="${v}" className="w-full aspect-video rounded-2xl my-3"></iframe>`);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 text-rose-600"
                        title="إضافة وسائط"
                      >
                        <VideoIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <textarea
                      ref={textareaRef}
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="أدخل محتوى المقال الكامل هنا..."
                      className="w-full p-4 bg-transparent text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">حالة النشر</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                  >
                    <option value="Published">نشر مباشر بالموقع</option>
                    <option value="Draft">حفظ كـ مسودة</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setWriteModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>

                <Button
                  onClick={() => {
                    if (!title.trim() || !content.trim()) {
                      toast.error("يرجى إدخال البيانات المطلوبة");
                      return;
                    }
                    createMutation.mutate({
                      title: title.trim(),
                      excerpt: excerpt.trim(),
                      content: content.trim(),
                      status,
                    });
                  }}
                  disabled={createMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>{status === "Draft" ? "حفظ المسودة" : "اعتماد وتدشين المقال"}</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: VIEW SPECIFIC ARTICLE */}
      <AnimatePresence>
        {viewBlogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right max-h-[85vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                  {viewBlogModal.title}
                </h3>
                {viewBlogModal.status === "Published" ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                    منشور
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                    مسودة
                  </span>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-bold">
                  <span>
                    الكاتب: {viewBlogModal.authorId?.firstName ? `${viewBlogModal.authorId.firstName} ${viewBlogModal.authorId.lastName}` : "المشرف العام"}
                  </span>
                  <span>تاريخ النشر: {new Date(viewBlogModal.createdAt).toLocaleDateString("ar-EG")}</span>
                </div>

                {viewBlogModal.excerpt && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">
                    "{viewBlogModal.excerpt}"
                  </div>
                )}

                <div
                  className="p-5 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewBlogModal.content }}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setViewBlogModal(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إغلاق
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
