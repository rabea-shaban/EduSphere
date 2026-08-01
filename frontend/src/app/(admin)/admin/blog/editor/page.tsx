"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Save,
  Send,
  UploadCloud,
  Image as ImageIcon,
  Tag,
  Globe,
  Trash2,
  Loader2,
  X,
  Plus,
  Search,
  Check,
  Edit,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminBlogService from "@/services/adminBlog.service";
import uploadService from "@/services/upload.service";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/common/tiptap-editor";

export default function ArticleRichTextEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const blogId = searchParams.get("id");

  // Basic Article State
  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<"Published" | "Draft">("Published");
  const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");

  // Cover Image State (Cloudflare R2 Upload)
  const [coverImage, setCoverImage] = React.useState("");
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [coverProgress, setCoverProgress] = React.useState(0);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  // SEO & Tags State
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");

  // Fetch Existing Blog if editing
  const { data: existingBlog, isLoading: isLoadingBlog } = useQuery({
    queryKey: ["admin", "blog", blogId],
    queryFn: () => adminBlogService.getBlogById(blogId!),
    enabled: Boolean(blogId),
  });

  // Populate state when existingBlog is loaded
  React.useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title || "");
      setExcerpt(existingBlog.excerpt || "");
      setContent(existingBlog.content || "");
      setStatus(existingBlog.status || "Published");
      setCoverImage(existingBlog.coverImage || existingBlog.thumbnail || "");
      setTags(existingBlog.tags || []);
      setMetaTitle(existingBlog.metaTitle || existingBlog.title || "");
      setMetaDescription(existingBlog.metaDescription || existingBlog.excerpt || "");
    }
  }, [existingBlog]);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setCoverProgress(10);
      const res = await uploadService.uploadImage(file, "blog-covers", (percent: number) => {
        setCoverProgress(Math.max(10, percent));
      });

      if (res?.url) {
        setCoverImage(res.url);
        toast.success("تم رفع صورة الغلاف بنجاح وتخزينها على Cloudflare R2 📸");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء رفع صورة الغلاف.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Handle Tags Input
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: (blogPayload: any) =>
      blogId
        ? adminBlogService.updateBlog(blogId, blogPayload)
        : adminBlogService.createBlog(blogPayload),
    onSuccess: (_, vars) => {
      toast.success(
        blogId
          ? "تم تحديث المقال بنجاح 🎉"
          : vars.status === "Draft"
          ? "تم حفظ المسودة بنجاح"
          : "تم نشر المقال بنجاح 🎉"
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
      router.push("/admin/blog");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ المقال.");
    },
  });

  const handleSave = (targetStatus: "Published" | "Draft") => {
    if (!title.trim() || !content.trim()) {
      toast.error("يرجى كتابة عنوان المقالة والمحتوى الرئيسي");
      return;
    }

    saveMutation.mutate({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      status: targetStatus,
      thumbnail: coverImage,
      coverImage: coverImage,
      tags: tags,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
    });
  };

  if (isLoadingBlog) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 text-right dir-rtl">
        <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-[#F58220]" />
          <span>جاري تحميل بيانات المقالة للتعديل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:bg-slate-200 transition-colors cursor-pointer"
            title="الرجوع لقائمة المقالات"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#F58220]/10 text-[#F58220] px-2.5 py-0.5 rounded-full text-[11px] font-black">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{blogId ? "وضع التعديل للمقالة" : "محرر المقالات المتقدم وإعدادات السيو SEO"}</span>
            </div>
            <h1 className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
              {blogId ? `تعديل المقالة: "${title}"` : "كتابة مقال جديد وتخصيص الغلاف والسيو"}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "edit"
                  ? "bg-[#0B2D5B] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              التنسيق والكتابة
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-[#0B2D5B] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              المعاينة المباشرة
            </button>
          </div>

          <Button
            onClick={() => handleSave("Draft")}
            variant="outline"
            disabled={saveMutation.isPending}
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <Save className="h-4 w-4 text-amber-500" />
            <span>حفظ مسودة</span>
          </Button>

          <Button
            onClick={() => handleSave("Published")}
            disabled={saveMutation.isPending}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5"
          >
            <Send className="h-4 w-4 text-[#F58220]" />
            <span>{blogId ? "حفظ التعديلات ونشر المقال" : "اعتماد ونشر المقال"}</span>
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      {viewMode === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column (Left/Middle 2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Article Title Input */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                عنوان المقال الرئيسي *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان المقال الرئيسي..."
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-black text-[#0B2D5B] dark:text-white outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Excerpt Summary Input */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                الملخص التنفيذي للمقال
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="ملخص قصير يظهر في كروت المدونة والواجهة..."
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>

            {/* TipTap Rich Text Editor Container */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                محتوى المقالة والتنسيق المتقدم (TipTap Rich Text Editor) *
              </label>
              <TipTapEditor
                value={content}
                onChange={setContent}
                placeholder="أدخل محتوى المقال والتفاصيل بالتنسيق الكامل والروابط والتنسيقات هنا..."
                minHeight="350px"
              />
            </div>

          </div>

          {/* Sidebar Column (Right 1 Column) */}
          <div className="space-y-4">
            
            {/* 1. ARTICLE COVER IMAGE CARD (Cloudflare R2 Upload) */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-black text-xs text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
                <ImageIcon className="h-4 w-4 text-[#F58220]" />
                <span>صورة غلاف المقالة (Cover Image)</span>
              </div>

              <input
                type="file"
                ref={coverInputRef}
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              {coverImage ? (
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video group">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                      title="حذف صورة الغلاف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    variant="outline"
                    className="w-full rounded-2xl text-xs font-bold gap-1.5"
                  >
                    <UploadCloud className="h-4 w-4 text-[#F58220]" />
                    <span>تغيير صورة الغلاف</span>
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-2xl p-5 text-center cursor-pointer hover:bg-slate-100/60 transition-colors space-y-2"
                >
                  {isUploadingCover ? (
                    <div className="space-y-2">
                      <Loader2 className="h-7 w-7 text-[#F58220] animate-spin mx-auto" />
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        جاري الرفع على Cloudflare R2... ({coverProgress}%)
                      </p>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F58220] transition-all duration-300"
                          style={{ width: `${coverProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-[#F58220] mx-auto" />
                      <div className="text-xs font-black text-[#0B2D5B] dark:text-white">
                        اختر صورة الغلاف من الجهاز
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">
                        يتم رفعها وحفظها على Cloudflare R2
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 2. SEO KEYWORDS & TAGS CARD */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-black text-xs text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
                <Tag className="h-4 w-4 text-emerald-500" />
                <span>الكلمات المفتاحية والتاجات (Tags)</span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 font-bold block">
                  اكتب الكلمة واضغط Enter أو فصلة (,)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="مثال: ثانوية_عامة، برمجة..."
                  className="w-full h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />

                {/* Tags Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-[11px] text-slate-400 font-medium">لم يتم إضافة كلمات مفتاحية بعد.</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. SEO META SETTINGS CARD */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-black text-xs text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>إعدادات السيو لمحركات البحث (SEO Meta)</span>
              </div>

              <div className="space-y-3 text-xs font-bold">
                {/* Meta Title */}
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-300">
                    عنوان المقالة بمحركات البحث (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title || "عنوان المقالة في نتائج Google..."}
                    className="w-full h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <label>وصف السيو (Meta Description)</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {metaDescription.length} / 160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={excerpt || "وصف مختصر وجذاب يظهر تحت الرابط بمحرك Google..."}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. PUBLISH STATUS SETTINGS CARD */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs font-bold">
              <h3 className="font-extrabold text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
                حالة النشر والعرض
              </h3>

              <div className="space-y-1">
                <label className="text-slate-500">الحالة التشغيلية للمقال</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                >
                  <option value="Published">منشور مباشرة للعموم</option>
                  <option value="Draft">مسودة محفوظة</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* LIVE VISUAL PREVIEW */
        <div className="bg-white dark:bg-[#0F274D] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 max-w-4xl mx-auto text-right">
          <div className="space-y-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <span className="text-xs font-black text-[#F58220] bg-[#F58220]/10 px-3 py-1 rounded-full">
              المعاينة المباشرة للمقال
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] dark:text-white leading-tight">
              {title || "عنوان المقال الرئيسي..."}
            </h1>
            {excerpt && (
              <p className="text-sm font-bold text-slate-500 italic border-r-4 border-[#F58220] pr-3">
                "{excerpt}"
              </p>
            )}

            {coverImage && (
              <div className="rounded-3xl overflow-hidden aspect-video border border-slate-200 dark:border-white/10 shadow-md">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Rendered HTML Content */}
          <div
            className="prose dark:prose-invert max-w-none text-sm sm:text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-200 space-y-4"
            dangerouslySetInnerHTML={{ __html: content || "<p className='text-slate-400 italic'>سيظهر محتوى المقال هنا...</p>" }}
          />
        </div>
      )}

    </div>
  );
}
