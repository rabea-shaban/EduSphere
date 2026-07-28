"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  PlayCircle,
  FileText,
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderPlus,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Video,
  File,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { FileUploader } from "@/components/common/file-uploader";

interface CourseItem {
  _id: string;
  id?: string;
  title: string;
  subject?: string;
}

interface UnitItem {
  _id: string;
  id?: string;
  title: string;
  order: number;
}

export default function CreateLessonPage() {
  const router = useRouter();

  // Form State
  const [courses, setCourses] = React.useState<CourseItem[]>([]);
  const [units, setUnits] = React.useState<UnitItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = React.useState("");
  const [selectedUnitId, setSelectedUnitId] = React.useState("");
  const [newUnitTitle, setNewUnitTitle] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [lessonType, setLessonType] = React.useState<"Video" | "PDF" | "Quiz" | "Assignment" | "Text">("Video");
  const [duration, setDuration] = React.useState<number>(15);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [attachmentUrl, setAttachmentUrl] = React.useState("");
  const [isPreview, setIsPreview] = React.useState(false);

  const [isLoadingCourses, setIsLoadingCourses] = React.useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [videoSourceMode, setVideoSourceMode] = React.useState<"upload" | "url">("upload");

  // Fetch Teacher's Courses on Mount
  React.useEffect(() => {
    async function fetchTeacherCourses() {
      try {
        setIsLoadingCourses(true);
        const res = await api.get("/courses?limit=100");
        const rawData = res.data?.data;
        const list: CourseItem[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.courses)
          ? rawData.courses
          : Array.isArray(res.data)
          ? res.data
          : [];
        setCourses(list);
        if (list.length > 0) {
          const firstId = list[0]._id || list[0].id || "";
          setSelectedCourseId(firstId);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
        toast.error("تعذر تحميل قائمة الكورسات الخاصة بك");
      } finally {
        setIsLoadingCourses(false);
      }
    }
    fetchTeacherCourses();
  }, []);

  // Fetch Units when Course Selection Changes
  React.useEffect(() => {
    if (!selectedCourseId) {
      setUnits([]);
      setSelectedUnitId("");
      return;
    }

    async function fetchUnits() {
      try {
        setIsLoadingUnits(true);
        const res = await api.get(`/units?courseId=${selectedCourseId}`);
        const rawData = res.data?.data;
        const unitList: UnitItem[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.units)
          ? rawData.units
          : Array.isArray(res.data)
          ? res.data
          : [];
        setUnits(unitList);
        if (unitList.length > 0) {
          const firstUnitId = unitList[0]._id || unitList[0].id || "";
          setSelectedUnitId(firstUnitId);
        } else {
          setSelectedUnitId("");
        }
      } catch (err) {
        console.error("Failed to load units:", err);
        setUnits([]);
      } finally {
        setIsLoadingUnits(false);
      }
    }

    fetchUnits();
  }, [selectedCourseId]);

  // Handle Create Unit on the fly if course has no units
  const handleQuickCreateUnit = async () => {
    if (!selectedCourseId) {
      toast.error("يرجى اختيار الكورس أولاً");
      return;
    }
    const unitTitleToUse = newUnitTitle.trim() || "الوحدة الأولى: أساسيات المنهج";
    try {
      const res = await api.post("/units", {
        title: unitTitleToUse,
        courseId: selectedCourseId,
        order: units.length + 1,
      });
      const createdUnit = res.data?.data || res.data;
      const createdUnitId = createdUnit._id || createdUnit.id;
      toast.success(`تم إنشاء "${unitTitleToUse}" بنجاح`);
      setUnits((prev) => [...prev, createdUnit]);
      setSelectedUnitId(createdUnitId);
      setNewUnitTitle("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر إنشاء الوحدة");
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      toast.error("يرجى اختيار الكورس التابع له الدرس");
      return;
    }

    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الدرس");
      return;
    }

    setIsSubmitting(true);
    toast.loading("جاري حفظ ونشر الدرس الجديد...", { id: "save-lesson" });

    try {
      let finalUnitId = selectedUnitId;

      // Auto-create a default unit if none exists for the selected course
      if (!finalUnitId) {
        const unitRes = await api.post("/units", {
          title: "الوحدة الأولى: مقدمة وتمهيد",
          courseId: selectedCourseId,
          order: 1,
        });
        const createdUnit = unitRes.data?.data || unitRes.data;
        finalUnitId = createdUnit._id || createdUnit.id;
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        courseId: selectedCourseId,
        sectionId: finalUnitId,
        unitId: finalUnitId,
        lessonType,
        duration: Number(duration) || 15,
        videoUrl: videoUrl.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
        isPreview,
        isPublished: true,
        status: "Published",
      };

      await api.post(`/teacher/sections/${finalUnitId}/lessons`, payload);

      toast.success("تم إضافة ونشر الدرس بنجاح! 🎬", { id: "save-lesson" });
      router.push("/teacher/lessons");
    } catch (err: any) {
      console.error("Create lesson error:", err);
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء حفظ ونشر الدرس", {
        id: "save-lesson",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-right dir-rtl max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-[#F58220]/10 text-[#F58220]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              إنشاء وحفظ درس منهجي جديد
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            نموذج إدراج المحتوى التعليمي المعاير، رفع الفيديوهات المرئية، وإرفاق المذكرات الدراسية
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>رجوع</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Course & Unit Selection */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <BookOpen className="h-5 w-5 text-[#F58220]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              1. اختيار الكورس والوحدة المنهجية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                الكورس المستهدف *
              </label>
              {isLoadingCourses ? (
                <div className="h-11 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
                >
                  {!Array.isArray(courses) || courses.length === 0 ? (
                    <option value="">لا توجد كورسات متاحة بعد</option>
                  ) : (
                    courses.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.title}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            {/* Unit Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                الوحدة التعليمية التابع لها الدرس
              </label>
              {isLoadingUnits ? (
                <div className="h-11 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ) : (
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
                >
                  {!Array.isArray(units) || units.length === 0 ? (
                    <option value="">(سيتم إنشاء وحدة افتراضية تلقائياً)</option>
                  ) : (
                    units.map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>
                        الوحدة {u.order}: {u.title}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>

          {/* Quick Unit Creation if no units */}
          {selectedCourseId && units.length === 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>هذا الكورس لا يحتوي على وحدات منهجية بعد. يمكنك إضافة وحدة سريعة هنا:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder="اسم الوحدة الجديدة..."
                  className="h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={handleQuickCreateUnit}
                  className="h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  إضافة الوحدة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Lesson Main Information */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <Layers className="h-5 w-5 text-[#1E73D8]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              2. بيانات الدرس الأساسية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                عنوان الدرس *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الدرس 05: تطبيقات المعادلات التفاضلية في الحركية الكيميائية"
                required
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Lesson Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                نوع المحتوى *
              </label>
              <select
                value={lessonType}
                onChange={(e: any) => setLessonType(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
              >
                <option value="Video">فيديو تعليمي (Video 🎬)</option>
                <option value="PDF">مستند / مذكرة (PDF 📄)</option>
                <option value="Text">درس قراءة / مقال (Text 📝)</option>
                <option value="Quiz">اختبار قصير (Quiz ❓)</option>
                <option value="Assignment">واجب دراسي (Assignment 📝)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                المدة المتوقعة (بالدقائق)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                  className="w-full h-11 px-4 pl-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <Clock className="h-4 w-4 absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                وصف موجز للدرس ومخرجاته (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="اكتب شرحاً مختصراً يوضح ما سيتعلمه الطالب في هذا الدرس..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Media & Attachments */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <Video className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
              3. ملفات الوسائط والملحقات
            </h2>
          </div>

          {/* Video Options Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">فيديو الدرس</label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVideoSourceMode("upload")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    videoSourceMode === "upload"
                      ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  رفع فيديو مباشر
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceMode("url")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    videoSourceMode === "url"
                      ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  رابط فيديو خارجي
                </button>
              </div>
            </div>

            {videoSourceMode === "upload" ? (
              <FileUploader
                category="video"
                folder="courses/videos"
                label="رفع فيديو الدرس الأصلي"
                helperText="اسحب ملف الفيديو هنا أو انقر لاختيار فيديو MP4/WebM"
                maxSizeMB={500}
                value={videoUrl}
                onChange={(url) => setVideoUrl(url)}
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="ضع رابط الفيديو هنا (مثال: https://commondatastorage.googleapis.com/... أو Vimeo/HLS)"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>
            )}
          </div>

          {/* Handout / Attachment Uploader */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              ارفاق ملحق / مذكرة الدرس (PDF, DOCX, ZIP)
            </label>
            <FileUploader
              category="document"
              folder="courses/attachments"
              label="ملحق الدرس التعليمي"
              helperText="قم برفع مذكرات، تمارين، أو ملفات تدريبية مرفقة بالدرس"
              maxSizeMB={50}
              value={attachmentUrl}
              onChange={(url) => setAttachmentUrl(url)}
            />
          </div>

          {/* Preview Toggle Option */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#1E73D8] transition-all">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="h-4 w-4 rounded accent-[#F58220] cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#0B2D5B] dark:text-white block">
                  إتاحة هذا الدرس كـ معاينة مجانية (Free Preview)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  يتيح للطلاب مشاهدة هذا الدرس مجاناً قبل دفع الاشتراك لتقييم الشرح والأسلوب
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingCourses}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black shadow-lg shadow-[#F58220]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSubmitting ? "جاري الحفظ والنشر..." : "حفظ ونشر الدرس الآن 🎬"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
