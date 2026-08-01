"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  Eye,
  Share2,
  User,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  Clock,
  Printer,
  ChevronRight,
  GraduationCap,
  Tag,
  Globe,
} from "lucide-react";
import { toast } from "react-hot-toast";
import blogService, { PublicBlogPost } from "@/services/blog.service";
import { Button } from "@/components/ui/button";

export default function PublicSingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [copied, setCopied] = React.useState(false);

  // Fetch Public Blog Post
  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ["public", "blog", id],
    queryFn: () => blogService.getPublicBlogById(id),
    enabled: Boolean(id),
  });

  // Dynamic Head & Meta Tags Injection for SEO & Social Sharing (Google, WhatsApp, Facebook, Twitter)
  React.useEffect(() => {
    if (!blog) return;

    const pageTitle = `${blog.metaTitle || blog.title} | EduSphere`;
    const pageDesc = blog.metaDescription || blog.excerpt || "مقال جديد وحصري على منصة EduSphere التعليمية.";
    const pageImage = blog.coverImage || blog.thumbnail || "";
    const pageKeywords = blog.tags && blog.tags.length > 0 ? blog.tags.join(", ") : "EduSphere, مقالات, ثانوية عامة, بكالوريا, برمجة";

    document.title = pageTitle;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', pageDesc);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', pageKeywords);

    // OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDesc);
    if (pageImage) setMetaTag('meta[property="og:image"]', 'property', 'og:image', pageImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'EduSphere');

    // Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
    if (pageImage) setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', pageImage);

  }, [blog]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("تم نسخ رابط المقال إلى الحافظة بنجاح 🚀");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#071C3B] p-6 flex items-center justify-center dir-rtl">
        <div className="max-w-3xl w-full space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded-2xl mx-auto" />
          <div className="h-14 w-full bg-slate-200 dark:bg-white/10 rounded-3xl" />
          <div className="h-96 w-full bg-slate-200 dark:bg-white/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#071C3B] p-6 flex items-center justify-center text-right dir-rtl">
        <div className="bg-white dark:bg-[#0F274D] p-10 rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-4 max-w-md w-full shadow-xl">
          <Sparkles className="h-12 w-12 text-[#F58220] mx-auto" />
          <h2 className="text-xl font-black text-[#0B2D5B] dark:text-white">
            المقالة غير موجودة أو تم حذفها
          </h2>
          <p className="text-xs text-slate-400">
            يرجى التأكد من صحة الرابط أو العودة لصفحة المقالات الرئيسية.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-2xl text-xs font-black gap-2 w-full"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>
        </div>
      </div>
    );
  }

  const categoryName = typeof blog.categoryId === "object" ? blog.categoryId?.name : "أخبار وتحديثات المنصة";
  const authorName =
    typeof blog.authorId === "object"
      ? `${blog.authorId?.firstName || ""} ${blog.authorId?.lastName || ""}`.trim() || "إدارة المنصة التعليمية"
      : "المشرف العام";
  const authorRole = typeof blog.authorId === "object" ? blog.authorId?.role || "محرر معتمد" : "Super Admin";
  const authorAvatar = typeof blog.authorId === "object" ? blog.authorId?.avatar : undefined;
  const coverImg = blog.coverImage || blog.thumbnail;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#071C3B] text-slate-800 dark:text-slate-100 transition-colors pb-20 dir-rtl text-right">
      
      {/* Top Header Nav */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#071C3B]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B2D5B] dark:hover:text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>المدونة والمقالات</span>
            </Link>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span className="text-xs font-bold text-[#F58220] truncate max-w-[200px]">{blog.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="rounded-2xl border-slate-200 dark:border-white/10 text-xs font-bold gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-500" />}
              <span>{copied ? "تم النسخ" : "مشاركة المقال"}</span>
            </Button>

            <Button
              onClick={handlePrint}
              variant="ghost"
              size="sm"
              className="rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              title="طباعة المقال"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Article Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6"
        >
          {/* Cover Image Header if exists */}
          {coverImg && (
            <div className="rounded-3xl overflow-hidden aspect-video border border-slate-200/80 dark:border-white/10 shadow-md">
              <img src={coverImg} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Category & Badge */}
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 bg-[#F58220]/10 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{categoryName}</span>
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Eye className="h-4 w-4 text-indigo-500" />
              <span>{blog.views || 1} مشاهدة</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] dark:text-white leading-tight">
            {blog.title}
          </h1>

          {/* Tags Badges */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {blog.tags.map((t) => (
                <span
                  key={t}
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-300 leading-relaxed border-r-4 border-[#F58220] pr-4 bg-slate-50 dark:bg-white/5 py-3 rounded-l-2xl">
              {blog.excerpt}
            </p>
          )}

          {/* Author & Meta Grid */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-500">
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#0B2D5B] text-white flex items-center justify-center font-black overflow-hidden shadow-xs">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-[#F58220]" />
                )}
              </div>
              <div>
                <div className="font-extrabold text-[#0B2D5B] dark:text-white text-sm">
                  {authorName}
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">{authorRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span>{new Date(blog.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* TipTap Rendered Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm leading-relaxed"
        >
          <div
            className="prose dark:prose-invert max-w-none text-sm sm:text-base font-semibold leading-loose text-slate-800 dark:text-slate-100 space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.article>

        {/* Platform CTA Banner Footer */}
        <div className="bg-gradient-to-r from-[#0B2D5B] via-[#0F274D] to-[#1E73D8] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <GraduationCap className="h-4 w-4" />
              <span>منصة EduSphere التعليمية الفائقة</span>
            </div>
            <h3 className="text-xl font-black">
              هل ترغب في الاستفادة من الكورسات والمسارات المعتمدة؟
            </h3>
            <p className="text-xs text-slate-200">
              استكشف أحدث الدورات التفاعلية والاختبارات الذكية ونظام البكالوريا الآن.
            </p>
          </div>

          <Link href="/courses">
            <Button className="bg-[#F58220] hover:bg-[#F58220]/90 text-white rounded-2xl px-6 py-6 font-black text-xs shadow-lg gap-2 shrink-0 cursor-pointer">
              <span>تصفح الكورسات المتاحة</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </main>

    </div>
  );
}
