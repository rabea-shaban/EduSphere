"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, BookOpen, Layers, AlertCircle } from "lucide-react";
import api from "@/services/api";
import { SectionList } from "@/features/teacher/components/sections/section-list";

interface CourseBasic {
  _id: string;
  title: string;
  status: string;
  teacher?: { firstName?: string; lastName?: string };
}

export default function CourseSectionsPage() {
  const params = useParams();
  const courseId = String(params?.id || "");

  const [course, setCourse] = React.useState<CourseBasic | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data?.data || null);
      } catch {
        setError("تعذر جلب بيانات الكورس. تأكد من صلاحيات الوصول.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="space-y-6 text-right dir-rtl">
      {/* ─── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/teacher/courses"
          className="hover:text-[#F58220] transition-colors font-semibold"
        >
          الكورسات
        </Link>
        <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        {isLoading ? (
          <span className="h-3 w-32 rounded bg-slate-200 dark:bg-white/10 animate-pulse inline-block" />
        ) : (
          <Link
            href={`/teacher/courses/${courseId}`}
            className="hover:text-[#F58220] transition-colors font-semibold truncate max-w-[180px]"
          >
            {course?.title || "الكورس"}
          </Link>
        )}
        <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        <span className="font-black text-[#0B2D5B] dark:text-white">إدارة الأقسام</span>
      </div>

      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <span className="h-12 w-12 rounded-2xl bg-[#F58220]/10 flex items-center justify-center shrink-0">
            <Layers className="h-6 w-6 text-[#F58220]" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
              إدارة أقسام الكورس
            </h1>
            {isLoading ? (
              <div className="h-3 w-48 rounded bg-slate-200 dark:bg-white/10 animate-pulse mt-1" />
            ) : course ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                {course.title}
              </p>
            ) : null}
          </div>
        </div>

        {/* Quick nav to lessons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="h-10 px-4 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:border-[#F58220] transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>تعديل الكورس</span>
          </Link>
        </div>
      </div>

      {/* ─── Error State ──────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-700/30">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      {/* ─── Info Banner ──────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-[#0B2D5B]/5 dark:bg-[#1E73D8]/10 border border-[#0B2D5B]/10 dark:border-[#1E73D8]/20">
        <div className="flex items-start gap-3">
          <Layers className="h-4 w-4 text-[#0B2D5B] dark:text-[#1E73D8] mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-black text-[#0B2D5B] dark:text-white">
              نظام بناء المحتوى التعليمي
            </p>
            <p>
              قم بإضافة الأقسام وترتيبها بالسحب والإفلات. كل قسم يحتوي على مجموعة من الدروس التعليمية.
              يمكنك تغيير حالة كل قسم (مسودة / منشور / مخفي / مؤرشف) وتحديد شروط إتمامه.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Section List (Main Component) ────────────────────────────────── */}
      {!error && (
        <SectionList
          courseId={courseId}
          courseTitle={course?.title}
        />
      )}
    </div>
  );
}
