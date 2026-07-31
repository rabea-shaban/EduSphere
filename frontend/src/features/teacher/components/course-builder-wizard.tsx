"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  Layers,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Video,
  File,
  Eye,
  Clock,
  Award,
  HelpCircle,
  Globe,
  UploadCloud,
  Paperclip,
  Check,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";

export type LessonContentType = "Video" | "PDF" | "Quiz" | "Assignment" | "Text";
export type ContentSourceType = "link" | "file" | "text";

export interface LessonDraft {
  id: string;
  title: string;
  lessonType: LessonContentType;
  contentSource: ContentSourceType;
  duration: number;
  isPreview: boolean;
  videoUrl?: string;
  attachmentUrl?: string;
  textContent?: string;
  fileName?: string;
}

export interface UnitDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

export function CourseBuilderWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);

  // Step 1 States
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("cs");
  const [stage, setStage] = React.useState("جميع المراحل");
  const [price, setPrice] = React.useState("450");
  const [isFree, setIsFree] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");

  // Step 2 Curriculum States (Units & Lessons)
  const [units, setUnits] = React.useState<UnitDraft[]>([
    {
      id: "u-1",
      title: "الوحدة الأولى: المفاهيم الأساسية والبناء الهيكلي",
      lessons: [
        {
          id: "l-1",
          title: "الدرس الأول: مقدمة في البناء والتفكير البرمجي",
          lessonType: "Video",
          contentSource: "link",
          videoUrl: "https://www.youtube.com/watch?v=sample",
          duration: 25,
          isPreview: true,
        },
        {
          id: "l-2",
          title: "الدرس الثاني: الهياكل والمفاهيم التطبيقية",
          lessonType: "PDF",
          contentSource: "file",
          fileName: "basics-guide.pdf",
          attachmentUrl: "https://edusphere.edu/docs/basics-guide.pdf",
          duration: 35,
          isPreview: false,
        },
      ],
    },
    {
      id: "u-2",
      title: "الوحدة الثانية: التطبيقات العملية والمشاريع المعتمدة",
      lessons: [
        {
          id: "l-3",
          title: "التطبيق العملي: مشروع تقييمي شامل",
          lessonType: "Assignment",
          contentSource: "link",
          attachmentUrl: "https://edusphere.edu/assignments/project-1",
          duration: 45,
          isPreview: false,
        },
      ],
    },
  ]);

  const [newUnitTitle, setNewUnitTitle] = React.useState("");
  const [activeUnitIdForLesson, setActiveUnitIdForLesson] = React.useState<string | null>(null);

  // Lesson form states
  const [newLessonTitle, setNewLessonTitle] = React.useState("");
  const [newLessonType, setNewLessonType] = React.useState<LessonContentType>("Video");
  const [newContentSource, setNewContentSource] = React.useState<ContentSourceType>("link");
  const [newLessonDuration, setNewLessonDuration] = React.useState(20);
  const [newLessonIsPreview, setNewLessonIsPreview] = React.useState(false);
  const [newLessonLink, setNewLessonLink] = React.useState("");
  const [newLessonText, setNewLessonText] = React.useState("");
  const [newLessonFileName, setNewLessonFileName] = React.useState("");
  const [newLessonFileUrl, setNewLessonFileUrl] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle lesson type change & sync default content source
  const handleTypeChange = (type: LessonContentType) => {
    setNewLessonType(type);
    if (type === "Video") {
      setNewContentSource("link");
    } else if (type === "PDF") {
      setNewContentSource("file");
    } else if (type === "Text") {
      setNewContentSource("text");
    } else {
      setNewContentSource("link");
    }
  };

  // Unit handlers
  const handleAddUnit = () => {
    if (!newUnitTitle.trim()) {
      toast.error("يرجى كتابة عنوان الوحدة التعليمية أولاً");
      return;
    }
    const newU: UnitDraft = {
      id: `u-${Date.now()}`,
      title: newUnitTitle.trim(),
      lessons: [],
    };
    setUnits([...units, newU]);
    setNewUnitTitle("");
    toast.success("تم إضافة الوحدة التعليمية بنجاح");
  };

  const handleRemoveUnit = (unitId: string) => {
    setUnits(units.filter((u) => u.id !== unitId));
  };

  // File Selection Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLessonFileName(file.name);
      // Simulate file upload URL or blob preview URL
      const fakeUrl = URL.createObjectURL(file);
      setNewLessonFileUrl(fakeUrl);
      toast.success(`تم اختيار الملف: ${file.name}`);
    }
  };

  // Lesson handlers
  const handleAddLessonToUnit = (unitId: string) => {
    if (!newLessonTitle.trim()) {
      toast.error("يرجى كتابة عنوان الدرس أولاً");
      return;
    }

    if (newContentSource === "link" && !newLessonLink.trim()) {
      toast.error("يرجى أدخل رابط المحتوى الرقمي أولاً");
      return;
    }

    if (newContentSource === "text" && !newLessonText.trim()) {
      toast.error("يرجى أدخل المحتوى النصي للدرس أولاً");
      return;
    }

    if (newContentSource === "file" && !newLessonFileName) {
      toast.error("يرجى اختيار ملف المحتوى من جهازك أولاً");
      return;
    }

    const newL: LessonDraft = {
      id: `l-${Date.now()}`,
      title: newLessonTitle.trim(),
      lessonType: newLessonType,
      contentSource: newContentSource,
      duration: Number(newLessonDuration) || 15,
      isPreview: newLessonIsPreview,
      videoUrl:
        newLessonType === "Video"
          ? newContentSource === "link"
            ? newLessonLink.trim()
            : newLessonFileUrl
          : undefined,
      attachmentUrl:
        newLessonType !== "Video" && newLessonType !== "Text"
          ? newContentSource === "link"
            ? newLessonLink.trim()
            : newLessonFileUrl
          : undefined,
      textContent: newContentSource === "text" ? newLessonText.trim() : undefined,
      fileName: newContentSource === "file" ? newLessonFileName : undefined,
    };

    setUnits(
      units.map((u) => {
        if (u.id === unitId) {
          return { ...u, lessons: [...u.lessons, newL] };
        }
        return u;
      })
    );

    // Reset lesson form state
    setNewLessonTitle("");
    setNewLessonLink("");
    setNewLessonText("");
    setNewLessonFileName("");
    setNewLessonFileUrl("");
    setActiveUnitIdForLesson(null);
    toast.success("تم إضافة الدرس ومحتواه إلى الوحدة بنجاح ✨");
  };

  const handleRemoveLesson = (unitId: string, lessonId: string) => {
    setUnits(
      units.map((u) => {
        if (u.id === unitId) {
          return { ...u, lessons: u.lessons.filter((l) => l.id !== lessonId) };
        }
        return u;
      })
    );
  };

  // Final Publish Handler
  const handleFinishCourse = async () => {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان البرنامج التعليمي أولاً");
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("جاري حفظ بيانات البرنامج والوحدات والدروس...", { id: "publish-course" });

      // 1. Create Course
      const coursePayload = {
        title: title.trim(),
        description: description.trim() || "وصف البرنامج التعليمي المعتمد لطلاب منصة EduSphere",
        price: isFree ? 0 : Number(price) || 0,
        isFree,
        status: "Published",
        level: stage || "جميع المراحل",
        category,
        thumbnailUrl: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      };

      const courseRes = await api.post("/teacher/courses", coursePayload);
      const createdCourse = courseRes.data?.data;
      const courseId = createdCourse?._id || createdCourse?.id;

      // 2. Create Units & Lessons
      if (courseId && units.length > 0) {
        for (let uIdx = 0; uIdx < units.length; uIdx++) {
          const u = units[uIdx];
          const unitRes = await api.post("/teacher/units", {
            title: u.title,
            courseId,
            order: uIdx + 1,
          });
          const createdUnit = unitRes.data?.data;
          const unitId = createdUnit?._id || createdUnit?.id;

          if (unitId && u.lessons.length > 0) {
            for (let lIdx = 0; lIdx < u.lessons.length; lIdx++) {
              const l = u.lessons[lIdx];
              await api.post("/teacher/lessons", {
                title: l.title,
                courseId,
                unitId,
                lessonType: l.lessonType,
                duration: l.duration,
                isPreview: l.isPreview,
                videoUrl: l.videoUrl || undefined,
                attachmentUrl: l.attachmentUrl || undefined,
                content: l.textContent || undefined,
                order: lIdx + 1,
                status: "Published",
              });
            }
          }
        }
      }

      toast.success("تم نشر الكورس المنهجي بجميع وحداته ودروسه بنجاح 🎉", { id: "publish-course" });
      router.push("/teacher/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ البرنامج والدروس.", { id: "publish-course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-right dir-rtl max-w-5xl mx-auto pb-12">
      {/* Wizard Header Progress Indicator */}
      <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
              باني الكورسات والمناهج الدراسية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              صمم مسارك التعليمي، صنف الدروس، وارفع الوسائط والمستندات بدقة واحترافية عالية
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3.5 py-1.5 rounded-full text-xs font-black">
            <Sparkles className="h-4 w-4" />
            <span>الخطوة {step} من 2</span>
          </div>
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
              step === 1
                ? "bg-[#0B2D5B] text-white shadow-md"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
            }`}
          >
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs shrink-0">
              1
            </div>
            <div className="text-right">
              <div className="text-xs font-extrabold">البيانات الأساسية والتسعير</div>
              <div className="text-[10px] opacity-75">اسم الكورس، الوصف، والمرحلة</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
              step === 2
                ? "bg-[#0B2D5B] text-white shadow-md"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
            }`}
          >
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs shrink-0">
              2
            </div>
            <div className="text-right">
              <div className="text-xs font-extrabold">منهجية الوحدات والدروس</div>
              <div className="text-[10px] opacity-75">إضافة الفيديو، PDF، والاختبارات</div>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6"
        >
          <h2 className="text-base font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#F58220]" />
            <span>معلومات البرنامج التعليمي</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان الكورس المنهجي *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: دورة الفيزياء الحديثة للصف الثالث الثانوي 2026"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">التخصص / المادة</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer dark:bg-[#0F274D]"
                >
                  <option value="cs">علوم الحاسب والتكنولوجيا</option>
                  <option value="physics">الفيزياء والعلوم العامة</option>
                  <option value="math">الرياضيات والهندسة</option>
                  <option value="languages">اللغات والترجمة</option>
                  <option value="chemistry">الكيمياء والأحياء</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المرحلة الدراسية</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer dark:bg-[#0F274D]"
                >
                  <option value="جميع المراحل">جميع المراحل التعليمية</option>
                  <option value="الثانوية العامة">الثانوية العامة</option>
                  <option value="المرحلة الإعدادية">المرحلة الإعدادية</option>
                  <option value="الجامعي">التعليم الجامعي</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سعر الاشتراك (ج.م)</label>
                <input
                  type="number"
                  disabled={isFree}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none disabled:opacity-40"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 cursor-pointer pb-3">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0B2D5B]"
                  />
                  <span>تقديم الكورس مجاناً للطلاب</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الوصف الشامل للكورس</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب نبذة ومخرجات التعلم المتوقعة من هذا البرنامج المنهجي..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  toast.error("يرجى كتابة عنوان الكورس أولاً");
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-2 h-11 px-6 rounded-2xl bg-[#0B2D5B] hover:bg-[#1E73D8] text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <span>المتابعة إلى منهج الوحدات والدروس</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Curriculum - Units & Lessons */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#F58220]" />
              <span>منهج الكورس والهيكل التعليمي</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">إجمالي الوحدات: {units.length}</span>
          </div>

          {/* Add New Unit Form */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newUnitTitle}
              onChange={(e) => setNewUnitTitle(e.target.value)}
              placeholder="اكتب اسم الوحدة التعليمية الجديدة (مثال: الوحدة الأولى: الفيزياء الكهرومغناطيسية)..."
              className="w-full sm:flex-1 h-11 px-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
            />
            <button
              type="button"
              onClick={handleAddUnit}
              className="w-full sm:w-auto h-11 px-5 rounded-2xl bg-[#F58220] hover:bg-[#FF9A2A] text-white text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة وحدة</span>
            </button>
          </div>

          {/* Units List */}
          <div className="space-y-6">
            {units.map((unit, uIdx) => (
              <div
                key={unit.id}
                className="p-5 rounded-3xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 space-y-4"
              >
                {/* Unit Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-[#0B2D5B] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      {uIdx + 1}
                    </span>
                    <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white">{unit.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveUnitIdForLesson(activeUnitIdForLesson === unit.id ? null : unit.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] text-xs font-black hover:bg-[#0B2D5B] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>إضافة درس</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(unit.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="حذف الوحدة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* INLINE ADD LESSON FORM */}
                {activeUnitIdForLesson === unit.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border-2 border-[#F58220]/40 shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                      <span className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                        <Plus className="h-4 w-4 text-[#F58220]" />
                        <span>إدخال تفاصيل ومحتوى الدرس الجديد</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Lesson Title */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">عنوان الدرس المنهجي *</label>
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="مثال: الدرس 1: مقدمة عن المفاهيم والقوانين..."
                          className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                        />
                      </div>

                      {/* Content Classification & Settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Type Select */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">تصنيف الدرس *</label>
                          <select
                            value={newLessonType}
                            onChange={(e) => handleTypeChange(e.target.value as LessonContentType)}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer dark:bg-[#0F274D]"
                          >
                            <option value="Video">🎥 فيديو تعليمي</option>
                            <option value="PDF">📑 مرفق PDF / مستند</option>
                            <option value="Text">📝 محتوى كتابي / درسي</option>
                            <option value="Quiz">❓ اختبار قصير</option>
                            <option value="Assignment">📋 واجب تطبيقي</option>
                          </select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">المدة (دقائق) *</label>
                          <input
                            type="number"
                            min={1}
                            value={newLessonDuration}
                            onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                          />
                        </div>

                        {/* Preview Checkbox */}
                        <div className="space-y-1 flex flex-col justify-end">
                          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 cursor-pointer pb-3 select-none">
                            <input
                              type="checkbox"
                              checked={newLessonIsPreview}
                              onChange={(e) => setNewLessonIsPreview(e.target.checked)}
                              className="h-4 w-4 rounded text-[#0B2D5B]"
                            />
                            <span>إتاحة كـ معاينة مجانية</span>
                          </label>
                        </div>
                      </div>

                      {/* Content Source Picker Segmented Switch */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">طريقة تقديم المحتوى المنهجي:</label>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setNewContentSource("link")}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              newContentSource === "link"
                                ? "bg-[#0B2D5B] text-white border-[#0B2D5B] shadow-xs"
                                : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                            }`}
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>عن طريق رابط</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewContentSource("file")}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              newContentSource === "file"
                                ? "bg-[#0B2D5B] text-white border-[#0B2D5B] shadow-xs"
                                : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                            }`}
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span>من ملف جهازك</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewContentSource("text")}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              newContentSource === "text"
                                ? "bg-[#0B2D5B] text-white border-[#0B2D5B] shadow-xs"
                                : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                            }`}
                          >
                            <AlignLeft className="h-3.5 w-3.5" />
                            <span>محتوى نصي</span>
                          </button>
                        </div>
                      </div>

                      {/* DYNAMIC CONTENT INPUTS */}
                      {/* 1. LINK INPUT */}
                      {newContentSource === "link" && (
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5 text-[#F58220]" />
                            <span>رابط المحتوى المباشر *</span>
                          </label>
                          <input
                            type="url"
                            value={newLessonLink}
                            onChange={(e) => setNewLessonLink(e.target.value)}
                            placeholder={
                              newLessonType === "Video"
                                ? "أدخل رابط الفيديو (مثال: https://youtube.com/watch?v=... أو رابط MP4/HLS)"
                                : newLessonType === "PDF"
                                ? "أدخل رابط مستند PDF المباشر (مثال: https://drive.google.com/... أو رابط مباشر)"
                                : "أدخل رابط المنظومة أو الاختبار الخارجي المباشر..."
                            }
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none dir-ltr text-right focus:border-[#F58220]"
                          />
                        </div>
                      )}

                      {/* 2. FILE UPLOAD INPUT */}
                      {newContentSource === "file" && (
                        <div className="space-y-2 pt-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <UploadCloud className="h-3.5 w-3.5 text-[#F58220]" />
                            <span>رفع الملف من الجهاز *</span>
                          </label>

                          <div className="relative border-2 border-dashed border-slate-200 dark:border-white/15 rounded-2xl p-4 text-center hover:border-[#F58220] transition-colors bg-slate-50/50 dark:bg-white/[0.02]">
                            <input
                              type="file"
                              accept={newLessonType === "Video" ? "video/*" : ".pdf,.docx,.pptx"}
                              onChange={handleFileSelect}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {newLessonFileName ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                                <Check className="h-4 w-4 stroke-[3]" />
                                <span>تم اختيار الملف: {newLessonFileName}</span>
                              </div>
                            ) : (
                              <div className="space-y-1 text-slate-500">
                                <Paperclip className="h-6 w-6 mx-auto text-slate-400" />
                                <p className="text-xs font-extrabold text-[#0B2D5B] dark:text-white">
                                  اضغط هنا لاختيار ملف {newLessonType === "Video" ? "فيديو" : "PDF/مستند"} من جهازك
                                </p>
                                <p className="text-[10px] text-slate-400">يدعم صيغ MP4, MOV, PDF, DOCX حتى حجم 500MB</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. TEXT CONTENT INPUT */}
                      {newContentSource === "text" && (
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <AlignLeft className="h-3.5 w-3.5 text-[#F58220]" />
                            <span>المحتوى النصي أو الملاحظات التعليمية *</span>
                          </label>
                          <textarea
                            rows={4}
                            value={newLessonText}
                            onChange={(e) => setNewLessonText(e.target.value)}
                            placeholder="اكتب نص الشرح، المقال التعليمي، أو التعليمات الكاملة للدرس..."
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => handleAddLessonToUnit(unit.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#0B2D5B] hover:bg-[#1E73D8] text-white text-xs font-black cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Check className="h-4 w-4" />
                          <span>حفظ الدرس والوسائط</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveUnitIdForLesson(null)}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Lessons List in Unit */}
                <div className="space-y-2">
                  {unit.lessons.length > 0 ? (
                    unit.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          {/* Type Icon Badge */}
                          <div className="h-9 w-9 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] flex items-center justify-center font-bold shrink-0">
                            {lesson.lessonType === "Video" ? (
                              <Video className="h-4 w-4 text-[#F58220]" />
                            ) : lesson.lessonType === "PDF" ? (
                              <File className="h-4 w-4 text-emerald-500" />
                            ) : lesson.lessonType === "Text" ? (
                              <AlignLeft className="h-4 w-4 text-blue-500" />
                            ) : lesson.lessonType === "Quiz" ? (
                              <HelpCircle className="h-4 w-4 text-purple-500" />
                            ) : (
                              <Award className="h-4 w-4 text-amber-500" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#0B2D5B] dark:text-white text-xs">{lesson.title}</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                {lesson.lessonType === "Video"
                                  ? "فيديو تعليمي"
                                  : lesson.lessonType === "PDF"
                                  ? "مرفق PDF"
                                  : lesson.lessonType === "Text"
                                  ? "محتوى كتابي"
                                  : lesson.lessonType === "Quiz"
                                  ? "اختبار قصير"
                                  : "واجب تطبيق"}
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-3 pt-1">
                              <span>⏱️ المدة: {lesson.duration} دقيقة</span>
                              {lesson.contentSource === "link" && <span className="text-blue-500 font-bold">🔗 عبر رابط</span>}
                              {lesson.contentSource === "file" && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                  📁 ملف: {lesson.fileName || "مستند مرفق"}
                                </span>
                              )}
                              {lesson.contentSource === "text" && <span className="text-purple-500 font-bold">✍️ نص مخصص</span>}
                              {lesson.isPreview && (
                                <span className="text-amber-600 font-bold">• متاحة للمعاينة المجانية</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(unit.id, lesson.id)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="حذف الدرس"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                      لا توجد دروس مضافة في هذه الوحدة بعد
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 px-5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              الرجوع للخطوة الأولى
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinishCourse}
              className="flex-1 h-11 px-6 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black shadow-lg shadow-[#F58220]/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>نشر الكورس بجميع الوحدات والدروس</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CourseBuilderWizard;
