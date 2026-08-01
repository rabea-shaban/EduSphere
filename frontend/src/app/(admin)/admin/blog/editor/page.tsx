"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  Palette,
  Eye,
  Send,
  Save,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCode,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminBlogService from "@/services/adminBlog.service";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/common/tiptap-editor";

export default function ArticleRichTextEditorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<"Published" | "Draft">("Published");
  const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");

  // Create/Publish Mutation
  const publishMutation = useMutation({
    mutationFn: (blogPayload: any) => adminBlogService.createBlog(blogPayload),
    onSuccess: (_, vars) => {
      toast.success(vars.status === "Draft" ? "تم حفظ المسودة بنجاح" : "تم نشر المقال بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
      router.push("/admin/blog");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ المقال.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:bg-slate-200 transition-colors"
            title="الرجوع لقائمة المقالات"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#F58220]/10 text-[#F58220] px-2.5 py-0.5 rounded-full text-[11px] font-black">
              <Sparkles className="h-3.5 w-3.5" />
              <span>محرر المقالات والمدونة المتقدم</span>
            </div>
            <h1 className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
              محرر التنسيق المتكامل وإدراج الوسائط
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
              className={`px-3 py-1.5 rounded-xl transition-all ${
                viewMode === "edit"
                  ? "bg-[#0B2D5B] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              التنسيق والتعديل
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                viewMode === "preview"
                  ? "bg-[#0B2D5B] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              المعاينة المباشرة
            </button>
          </div>

          <Button
            onClick={() => {
              if (!title.trim() || !content.trim()) {
                toast.error("يرجى كتابة عنوان المقالة والمحتوى");
                return;
              }
              publishMutation.mutate({
                title: title.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                status: "Draft",
              });
            }}
            variant="outline"
            disabled={publishMutation.isPending}
            className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5"
          >
            <Save className="h-4 w-4 text-amber-500" />
            <span>حفظ مسودة</span>
          </Button>

          <Button
            onClick={() => {
              if (!title.trim() || !content.trim()) {
                toast.error("يرجى كتابة عنوان المقالة والمحتوى");
                return;
              }
              publishMutation.mutate({
                title: title.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                status: "Published",
              });
            }}
            disabled={publishMutation.isPending}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5"
          >
            <Send className="h-4 w-4" />
            <span>اعتماد ونشر المقال</span>
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      {viewMode === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Writing Column */}
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

          {/* Sidebar Information Column */}
          <div className="space-y-4">
            
            {/* Publish Settings */}
            <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs font-bold">
              <h3 className="font-extrabold text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
                حالة النشر والعرض
              </h3>

              <div className="space-y-1">
                <label className="text-slate-500">الحالة التشغيلية</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                >
                  <option value="Published">منشور مباشرة</option>
                  <option value="Draft">مسودة محفوظة</option>
                </select>
              </div>
            </div>

            {/* Formatting Tips */}
            <div className="bg-amber-500/5 p-5 rounded-3xl border border-amber-500/20 space-y-2 text-xs text-amber-950 dark:text-amber-300">
              <h4 className="font-extrabold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#F58220]" />
                <span>إرشادات النشر والتنسيق</span>
              </h4>
              <p className="text-[11px] leading-relaxed opacity-90">
                يمكنك تخصيص الخطوط وتنسيق العناوين وإضافة الصور والوسائط المضمنة باستخدام أزرار شريط التنسيق بالعلوي والمعاينة المباشرة قبل النشر.
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* LIVE VISUAL PREVIEW */
        <div className="bg-white dark:bg-[#0F274D] p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 max-w-4xl mx-auto text-right">
          <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-6">
            <span className="text-xs font-black text-[#F58220] bg-[#F58220]/10 px-3 py-1 rounded-full">
              المعاينة المباشرة للمقال
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white leading-tight">
              {title || "عنوان المقال الرئيسي..."}
            </h1>
            {excerpt && (
              <p className="text-sm font-bold text-slate-500 italic">
                "{excerpt}"
              </p>
            )}
          </div>

          {/* Rendered HTML Content */}
          <div
            className="prose dark:prose-invert max-w-none text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200 space-y-4"
            dangerouslySetInnerHTML={{ __html: content || "<p className='text-slate-400 italic'>سيظهر المحتوى هنا عند البدء في الكتابة...</p>" }}
          />
        </div>
      )}

    </div>
  );
}
