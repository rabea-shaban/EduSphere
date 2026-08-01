"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  BookOpen,
  Sparkles,
  User,
  Calendar,
  Eye,
  ArrowLeft,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  TrendingUp,
} from "lucide-react";
import blogService, { PublicBlogPost } from "@/services/blog.service";
import { Button } from "@/components/ui/button";

export default function PublicBlogListPage() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(9);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Public Published Blogs
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public", "blogs-list", page, limit, debouncedSearch],
    queryFn: () =>
      blogService.getPublicBlogs({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
      }),
  });

  const blogs = data?.blogs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Split featured post (first item) and standard grid
  const featuredPost = blogs.length > 0 && page === 1 && !debouncedSearch ? blogs[0] : null;
  const gridPosts = featuredPost ? blogs.slice(1) : blogs;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#071C3B] text-slate-800 dark:text-slate-100 transition-colors pb-20 dir-rtl text-right">
      
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2D5B] via-[#0F274D] to-[#071C3B] text-white pt-16 pb-20 px-4 sm:px-8 border-b border-white/10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F58220]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-black text-[#F58220]"
          >
            <Sparkles className="h-4 w-4" />
            <span>مدونة EduSphere الأكاديمية والمقالات المعتمدة</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black leading-tight tracking-tight max-w-3xl mx-auto"
          >
            أحدث الشروحات الأكاديمية والتحليلات البرمجية والتعليمية
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 font-bold max-w-2xl mx-auto leading-relaxed opacity-90"
          >
            اكتشف المقالات الحصرية المصممة لطلاب الثانوية العامة، الأزهري، نظام البكالوريا الجديد، ومسار علوم الحاسب والتكنولوجيا.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative pt-4"
          >
            <div className="relative">
              <Search className="h-5 w-5 absolute right-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن المقال، الموضوع، أو الكلمة المفتاحية..."
                className="w-full h-12 pr-12 pl-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-300 outline-none focus:border-[#F58220] transition-colors"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Body Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white dark:bg-[#0F274D] p-12 rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              لا توجد مقالات مطابقة للبحث حالياً
            </h3>
            <p className="text-xs text-slate-400">
              جرب تغيير كلمة البحث أو تصفح باقي أجزاء المنصة.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post Banner */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 shadow-lg relative overflow-hidden group hover:border-[#F58220]/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="space-y-4 lg:w-2/3">
                    
                    <div className="flex items-center gap-2">
                      <span className="bg-[#F58220]/10 text-[#F58220] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>مقال متميز ورئيسي</span>
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        • {new Date(featuredPost.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white group-hover:text-[#F58220] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-bold leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-[#0B2D5B] text-white flex items-center justify-center font-black">
                          <User className="h-4 w-4 text-[#F58220]" />
                        </div>
                        <span className="text-[#0B2D5B] dark:text-white">
                          {typeof featuredPost.authorId === "object"
                            ? `${featuredPost.authorId?.firstName || ""} ${featuredPost.authorId?.lastName || ""}`.trim() || "إدارة المنصة"
                            : "المشرف العام"}
                        </span>
                      </div>

                      <Link href={`/blog/${featuredPost.slug || featuredPost._id}`}>
                        <Button className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-2xl text-xs font-black gap-2 shadow-md">
                          <span>قراءة المقالة بالكامل</span>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                  </div>

                  {/* Icon Card Preview */}
                  <div className="w-full lg:w-1/3 bg-slate-100 dark:bg-white/5 rounded-2xl p-8 flex items-center justify-center border border-slate-200/60 dark:border-white/10 min-h-[180px]">
                    <FileText className="h-20 w-20 text-[#0B2D5B]/30 dark:text-white/20 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid Posts Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
              <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#F58220]" />
                <span>جميع المقالات المنشورة ({total})</span>
              </h3>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post: PublicBlogPost) => {
                const authorName =
                  typeof post.authorId === "object"
                    ? `${post.authorId?.firstName || ""} ${post.authorId?.lastName || ""}`.trim() || "إدارة المنصة"
                    : "المشرف العام";

                return (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group hover:border-[#F58220]/40"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                          مقال أكاديمي
                        </span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{post.views || 1} مشاهدة</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-[#0B2D5B] dark:text-white group-hover:text-[#F58220] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      {post.excerpt && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <User className="h-3.5 w-3.5 text-[#F58220]" />
                        <span className="line-clamp-1">{authorName}</span>
                      </div>

                      <Link href={`/blog/${post.slug || post._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#0B2D5B] dark:text-[#F58220] hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-black gap-1"
                        >
                          <span>قراءة المقال</span>
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-500">
                <span>
                  صفحة {page} من {totalPages} (إجمالي {total} مقالة)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1 text-xs"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>السابق</span>
                  </Button>
                  <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1 text-xs"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
}
