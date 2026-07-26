"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, PlayCircle, FileText, ArrowLeft, Sparkles } from "lucide-react";

export default function CreateLessonPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [course, setCourse] = React.useState("course-cs-101");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    alert("تم إضافة الدرس بنجاح إلى الكورس!");
    router.push("/teacher/lessons");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إضافة درس جديد 🎬
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم بإدخال عنوان الدرس، رابط الفيديو أو ارفعه مباشرة مع الملفات الملحقة
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 max-w-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">اختر الكورس التابع له</label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="course-cs-101">أساسيات علوم الحاسب والبرمجة</option>
            <option value="course-ai-202">الذكاء الاصطناعي وتعلم الآلة</option>
            <option value="course-bac-101">مهارات البحث - البكالوريا الدولية</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الدرس</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: الدرس 27: تطبيقات Linked Lists بلغة C++"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">رابط الفيديو (Vimeo / HLS / MP4)</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://commondatastorage.googleapis.com/..."
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSubmitting ? "جاري الحفظ..." : "حفظ ونشر الدرس"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
