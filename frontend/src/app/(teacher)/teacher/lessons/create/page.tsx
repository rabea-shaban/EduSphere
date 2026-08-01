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
  Volume2,
  Check,
  ShieldCheck,
  Globe,
  Radio,
  FileDown,
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

  // Form & Selection State
  const [courses, setCourses] = React.useState<CourseItem[]>([]);
  const [units, setUnits] = React.useState<UnitItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = React.useState("");
  const [selectedUnitId, setSelectedUnitId] = React.useState("");
  const [newUnitTitle, setNewUnitTitle] = React.useState("");

  // Lesson Attributes
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [lessonType, setLessonType] = React.useState<"Video" | "Audio" | "PDF" | "Quiz" | "Assignment" | "Text">("Video");
  const [duration, setDuration] = React.useState<number>(15);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [audioUrl, setAudioUrl] = React.useState("");
  const [attachmentUrl, setAttachmentUrl] = React.useState("");
  const [isPreview, setIsPreview] = React.useState(false);

  // Status & Media Source Selectors
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [videoSourceMode, setVideoSourceMode] = React.useState<"upload" | "url">("upload");
  const [audioSourceMode, setAudioSourceMode] = React.useState<"upload" | "url">("upload");

  // 1. Fetch Teacher Courses on Mount
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

  // 2. Fetch Units when Selected Course Changes
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

  // 3. Quick Unit Creation Handler
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
      toast.success(`تم إضافة "${unitTitleToUse}" بنجاح`);
      setUnits((prev) => [...prev, createdUnit]);
      setSelectedUnitId(createdUnitId);
      setNewUnitTitle("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر إنشاء الوحدة المنهجية");
    }
  };

  // 4. Form Submission Handler
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
    toast.loading("جاري حفظ ونشر الدرس الجديد على السيرفر...", { id: "save-lesson" });

    try {
      let finalUnitId = selectedUnitId;

      // Auto-create unit if course currently has no units
      if (!finalUnitId) {
        const unitRes = await api.post("/units", {
          title: "الوحدة الأولى: مقدمة وتمهيد المنهج",
          courseId: selectedCourseId,
          order: 1,
        });
        const createdUnit = unitRes.data?.data || unitRes.data;
        finalUnitId = createdUnit._id || createdUnit.id;
      }

      const mediaUrl =
        lessonType === "Video"
          ? videoUrl.trim()
          : lessonType === "Audio"
          ? audioUrl.trim()
          : undefined;

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        courseId: selectedCourseId,
        sectionId: finalUnitId,
        unitId: finalUnitId,
        lessonType,
        duration: Number(duration) || 15,
        videoUrl: mediaUrl,
        audioUrl: audioUrl.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
        isPreview,
        isPublished: true,
        status: "Published",
      };

      await api.post(`/teacher/sections/${finalUnitId}/lessons`, payload);

      toast.success("تم إضافة ونشر الدرس بنجاح على المنصة!", { id: "save-lesson" });
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
    <div className="space-y-8 text-right dir-rtl max-w-5xl mx-auto pb-16">
      {/* Business Grade Executive Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#0B2D5B] to-[#1E73D8] text-white shadow-md">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white tracking-tight">
                إدارة وإضافة المحتوى التعليمي والدروس المنهجية
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            مركز التحكم التنفيذي لإدراج الدروس، رفع الفيديو والصوت عالي الجودة، وإدارة المرفقات المنهجية
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          <span>الرجوع للدروس</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Course & Section Selection */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-xl bg-[#F58220]/15 text-[#F58220] text-xs font-black flex items-center justify-center">
                01
              </span>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تحديد الكورس والوحدة المنهجية
              </h2>
            </div>
            <span className="text-[11px] font-bold text-[#F58220] bg-[#F58220]/10 px-3 py-1 rounded-full border border-[#F58220]/20">
              خطوة أساسية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <span>الكورس المستهدف</span>
                <span className="text-rose-500">*</span>
              </label>
              {isLoadingCourses ? (
                <div className="h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
                >
                  {!Array.isArray(courses) || courses.length === 0 ? (
                    <option value="">لا توجد كورسات متاحة حالياً</option>
                  ) : (
                    courses.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.title} {c.subject ? `(${c.subject})` : ""}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            {/* Unit Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                الوحدة التعليمية / الفصلي الدراسية
              </label>
              {isLoadingUnits ? (
                <div className="h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ) : (
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
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

          {/* Quick Unit Creation */}
          {selectedCourseId && units.length === 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>هذا الكورس لا يحتوي على وحدات بعد. يمكنك إضافة اسم الوحدة فوراً:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder="اسم الوحدة الجديدة..."
                  className="h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={handleQuickCreateUnit}
                  className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  إضافة الوحدة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Main Lesson Details */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-xl bg-[#1E73D8]/15 text-[#1E73D8] text-xs font-black flex items-center justify-center">
                02
              </span>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تفاصيل وبيانات الدرس الأساسية
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lesson Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <span>عنوان الدرس المنهجي</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الشرح المتكامل لمعادلات الحركة والسرعة المتجهة"
                required
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Content Type Selector Cards */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                نوع المحتوى والوسيط التفاعلي *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: "Video", label: "فيديو مرئي", icon: Video, color: "text-emerald-500 bg-emerald-500/10" },
                  { id: "Audio", label: "مقطع صوتي", icon: Volume2, color: "text-indigo-500 bg-indigo-500/10" },
                  { id: "PDF", label: "مستند / PDF", icon: FileText, color: "text-[#1E73D8] bg-[#1E73D8]/10" },
                  { id: "Text", label: "درس مقال", icon: File, color: "text-amber-500 bg-amber-500/10" },
                  { id: "Quiz", label: "اختبار قصير", icon: Sparkles, color: "text-purple-500 bg-purple-500/10" },
                  { id: "Assignment", label: "واجب تطبيقي", icon: CheckCircle2, color: "text-rose-500 bg-rose-500/10" },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = lessonType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLessonType(item.id as any)}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${
                        isSelected
                          ? "border-[#F58220] bg-[#F58220]/10 text-[#0B2D5B] dark:text-white shadow-sm ring-2 ring-[#F58220]/20"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <span className={`p-2 rounded-xl ${item.color}`}>
                        <IconComp className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-black">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Duration */}
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
                  className="w-full h-12 px-4 pl-10 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
                <Clock className="h-4 w-4 absolute left-3.5 top-4 text-slate-400" />
              </div>
            </div>

            {/* Lesson Summary / Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                وصف الدرس والأهداف التعليمية (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="اكتب ملخصاً توضيحياً يبين أهم المفاهيم التي سينفذها الطالب خلال هذا الدرس..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Media & Attachment Uploads */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 text-xs font-black flex items-center justify-center">
                03
              </span>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                رفع وحفظ ملفات الوسائط والتسجيلات التعليمية
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              تخزين سحابي آمن ومباشر
            </span>
          </div>

          {/* Video Section */}
          {lessonType === "Video" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Video className="h-4 w-4 text-emerald-500" />
                  <span>فيديو الدرس الأصلي</span>
                </label>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode("upload")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      videoSourceMode === "upload"
                        ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    رفع فيديو سحابي مباشر
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode("url")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      videoSourceMode === "url"
                        ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    رابط خارجي / HLS
                  </button>
                </div>
              </div>

              {videoSourceMode === "upload" ? (
                <FileUploader
                  category="video"
                  folder="courses/videos"
                  label="رفع ملف الفيديو الأصلي (MP4, MOV, WebM)"
                  helperText="اسحب ملف الفيديو هنا أو انقر لاختيار الملف لرفعه وتخزينه سحابياً"
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
                    placeholder="أدخل رابط الفيديو المباشر..."
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                  />
                </div>
              )}

              {/* Video Preview */}
              {videoUrl && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 block">معاينة مشغل الفيديو:</span>
                  <video src={videoUrl} controls className="w-full max-h-64 rounded-xl outline-none" />
                </div>
              )}
            </div>
          )}

          {/* Audio Section */}
          {lessonType === "Audio" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-indigo-500" />
                  <span>التسجيل الصوتي للدرس</span>
                </label>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAudioSourceMode("upload")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      audioSourceMode === "upload"
                        ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    رفع مقطع صوتي مباشر
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioSourceMode("url")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      audioSourceMode === "url"
                        ? "bg-white dark:bg-slate-800 text-[#0B2D5B] dark:text-white shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    رابط صوتي خارجي
                  </button>
                </div>
              </div>

              {audioSourceMode === "upload" ? (
                <FileUploader
                  category="audio"
                  folder="courses/audio"
                  label="رفع التسجيل الصوتي (MP3, WAV, M4A, OGG)"
                  helperText="اسحب المقطع الصوتي هنا أو انقر لاختيار الملف لرفعه وتخزينه سحابياً"
                  maxSizeMB={50}
                  value={audioUrl}
                  onChange={(url) => setAudioUrl(url)}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="أدخل رابط المقطع الصوتي هنا..."
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                  />
                </div>
              )}

              {/* Audio Preview */}
              {audioUrl && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-500 block">معاينة الصوت:</span>
                  <audio src={audioUrl} controls className="w-full h-10 outline-none" />
                </div>
              )}
            </div>
          )}

          {/* Document Attachment Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 block">
              <FileDown className="h-4 w-4 text-[#1E73D8]" />
              <span>إرفاق المذكرات والتمارين (PDF, DOCX, ZIP)</span>
            </label>
            <FileUploader
              category="document"
              folder="courses/attachments"
              label="المستند والملحق التعليمي المرفق"
              helperText="قم برفع مذكرات، كراسة تمارين، أو ملحقات تدريبية مرفقة بالدرس"
              maxSizeMB={50}
              value={attachmentUrl}
              onChange={(url) => setAttachmentUrl(url)}
            />
          </div>
        </div>

        {/* Step 4: Settings & Visibility */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-600 text-xs font-black flex items-center justify-center">
                04
              </span>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إعدادات الإتاحة وصلاحيات المشاهدة
              </h2>
            </div>
          </div>

          <label className="flex items-start gap-4 cursor-pointer p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#1E73D8] transition-all">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="h-5 w-5 rounded accent-[#F58220] cursor-pointer mt-0.5"
            />
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#0B2D5B] dark:text-white block">
                تفعيل المعاينة المجانية لهذا الدرس (Free Preview)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                يسمح للطلاب غير المكتتبين برؤية هذا الدرس مجاناً لتقييم أسلوب الشرح قبل الدفع.
              </p>
            </div>
          </label>
        </div>

        {/* Executive Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer text-center"
          >
            إلغاء التغييرات
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingCourses}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#F58220] hover:opacity-95 text-white text-xs font-black shadow-lg shadow-[#0B2D5B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSubmitting ? "جاري حفظ ونشر الدرس..." : "حفظ ونشر الدرس المنهجي الآن"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
