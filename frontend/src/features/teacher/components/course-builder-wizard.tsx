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
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { FileUploader } from "@/components/common/file-uploader";

interface LessonDraft {
  id: string;
  title: string;
  lessonType: "Video" | "PDF" | "Quiz" | "Assignment" | "Text";
  duration: number;
  isPreview: boolean;
  videoUrl?: string;
}

interface UnitDraft {
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
          duration: 25,
          isPreview: true,
        },
        {
          id: "l-2",
          title: "الدرس الثاني: الهياكل والمفاهيم التطبيقية",
          lessonType: "Video",
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
  const [newLessonType, setNewLessonType] = React.useState<"Video" | "PDF" | "Quiz" | "Assignment" | "Text">("Video");
  const [newLessonDuration, setNewLessonDuration] = React.useState(20);
  const [newLessonIsPreview, setNewLessonIsPreview] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Unit handlers
  const handleAddUnit = () => {
    if (!newUnitTitle.trim()) return;
    const newU: UnitDraft = {
      id: `u-${Date.now()}`,
      title: newUnitTitle.trim(),
      lessons: [],
    };
    setUnits([...units, newU]);
    setNewUnitTitle("");
  };

  const handleRemoveUnit = (unitId: string) => {
    setUnits(units.filter((u) => u.id !== unitId));
  };

  // Lesson handlers
  const handleAddLessonToUnit = (unitId: string) => {
    if (!newLessonTitle.trim()) {
      toast.error("يرجى كتابة عنوان الدرس أولاً");
      return;
    }

    const newL: LessonDraft = {
      id: `l-${Date.now()}`,
      title: newLessonTitle.trim(),
      lessonType: newLessonType,
      duration: Number(newLessonDuration) || 15,
      isPreview: newLessonIsPreview,
    };

    setUnits(
      units.map((u) => {
        if (u.id === unitId) {
          return { ...u, lessons: [...u.lessons, newL] };
        }
        return u;
      })
    );

    setNewLessonTitle("");
    setActiveUnitIdForLesson(null);
    toast.success("تم إضافة الدرس إلى الوحدة التعليمية بنجاح");
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
        thumbnail: thumbnail || undefined,
      };

      const courseRes = await api.post("/courses", coursePayload);
      const createdCourse = courseRes.data?.data || courseRes.data;
      const courseId = createdCourse._id || createdCourse.id;

      // 2. Create Units & Lessons
      if (courseId && units.length > 0) {
        for (let uIdx = 0; uIdx < units.length; uIdx++) {
          const u = units[uIdx];
          try {
            const unitRes = await api.post("/units", {
              title: u.title,
              courseId,
              order: uIdx + 1,
            });
            const createdUnit = unitRes.data?.data || unitRes.data;
            const unitId = createdUnit._id || createdUnit.id;

            // Create lessons under this unit
            if (unitId && u.lessons.length > 0) {
              for (let lIdx = 0; lIdx < u.lessons.length; lIdx++) {
                const l = u.lessons[lIdx];
                try {
                  await api.post("/lessons", {
                    title: l.title,
                    courseId,
                    unitId,
                    lessonType: l.lessonType,
                    duration: l.duration,
                    order: lIdx + 1,
                    isPreview: l.isPreview,
                  });
                } catch (lErr) {
                  console.error("Lesson creation note:", lErr);
                }
              }
            }
          } catch (uErr) {
            console.error("Unit creation note:", uErr);
          }
        }
      }

      toast.success("تم اعتماد ونشر البرنامج التعليمي بنجاح", { id: "publish-course" });
      router.push("/teacher/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء حفظ ونشر البرنامج التعليمي", { id: "publish-course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalLessonsCount = units.reduce((acc, u) => acc + u.lessons.length, 0);

  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xl text-right dir-rtl space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] text-xs font-black mb-2">
            <span>منظومة إدارة المحتوى والبرامج التعليمية</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white">
            استوديو إعداد وتوثيق البرامج والمناهج
          </h2>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: "البيانات الأساسية والسعر" },
            { num: 2, label: "هيكل المنهج والدروس" },
            { num: 3, label: "المعاينة والتأكيد النهائي" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num > 1 && !title.trim()) {
                  toast.error("يرجى كتابة عنوان البرنامج التعليمي أولاً");
                  return;
                }
                setStep(s.num);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                step === s.num
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-md"
                  : "bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-700"
              }`}
            >
              {s.num}. {s.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Basic Details, Cover Image & Pricing */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 max-w-2xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">عنوان البرنامج التعليمي *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان البرنامج التعليمي بالكامل..."
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-extrabold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">المسار والتصنيف التعليمي</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-extrabold outline-none cursor-pointer dark:bg-[#0F274D]"
                >
                  <option value="cs">علوم الحاسب والتكنولوجيا</option>
                  <option value="general">التعليم العام (مرحلة الثانوية)</option>
                  <option value="azhari">الأزهر الشريف</option>
                  <option value="baccalaureate">البكالوريا الدولية</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200">المرحلة الدراسية المستهدفة</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-extrabold outline-none cursor-pointer dark:bg-[#0F274D]"
                >
                  <option value="جميع المراحل">جميع المراحل الدراسية</option>
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي (الثانوية العامة)</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span>رسوم وخطط الاشتراك</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="h-4 w-4 rounded text-[#F58220] focus:ring-0 cursor-pointer"
                  />
                  <span>برنامج مفتوح ومجاني</span>
                </label>
              </div>

              {!isFree && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400">سعر الاشتراك (بالجنيه المصري)</span>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="450"
                    className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-extrabold outline-none focus:border-[#F58220]"
                  />
                </div>
              )}
            </div>

            {/* Cloudinary Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">صورة غلاف البرنامج الرسمي</label>
              <FileUploader
                value={thumbnail}
                onChange={(url) => setThumbnail(url)}
                folder="courses"
                label="اختر صورة الغلاف الرسمية"
                helperText="ارفع صورة الغلاف المعتمدة تعكس محتوى المنهج التعليمي"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">وصف المنهج والمخرجات التعليمية</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="اكتب شرحاً مفصلاً يحدد أهداف المنهج والمخرجات التعليمية لطلاب المنصة..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  toast.error("يرجى كتابة عنوان البرنامج التعليمي أولاً");
                  return;
                }
                setStep(2);
              }}
              className="px-6 h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center gap-2 hover:bg-[#F58220] transition-colors cursor-pointer"
            >
              <span>متابعة لبناء الفصول المنهجية والدروس</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: Curriculum Units */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-2xl"
          >
            {/* Add Unit Input */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <label className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#F58220]" />
                <span>إضافة وحدة دراسية / فصل جديد</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder="عنوان الوحدة أو الفصل الجديد..."
                  className="flex-1 h-11 px-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="h-11 px-5 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center gap-1 cursor-pointer hover:opacity-90 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة وحدة</span>
                </button>
              </div>
            </div>

            {/* Units & Lessons Accordion/List */}
            <div className="space-y-4">
              {units.map((unit, uIdx) => (
                <div
                  key={unit.id}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-4"
                >
                  {/* Unit Title Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-xl bg-[#0B2D5B] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {uIdx + 1}
                      </span>
                      <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white">{unit.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveUnitIdForLesson(activeUnitIdForLesson === unit.id ? null : unit.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] text-xs font-black hover:bg-[#0B2D5B] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>إضافة درس</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(unit.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="حذف الوحدة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add Lesson Form Inline if active */}
                  {activeUnitIdForLesson === unit.id && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-300 dark:border-white/20 space-y-3">
                      <div className="text-xs font-black text-[#0B2D5B] dark:text-white">إدخال تفاصيل الدرس:</div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                          placeholder="عنوان الدرس المنهجي..."
                          className="w-full h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">تصنيف الدرس</label>
                          <select
                            value={newLessonType}
                            onChange={(e) => setNewLessonType(e.target.value as any)}
                            className="w-full h-10 px-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none cursor-pointer dark:bg-[#0F274D]"
                          >
                            <option value="Video">فيديو تعليمي</option>
                            <option value="PDF">مرفق PDF</option>
                            <option value="Quiz">اختبار قصير</option>
                            <option value="Assignment">واجب تطبيقي</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">المدة (دقائق)</label>
                          <input
                            type="number"
                            min={1}
                            value={newLessonDuration}
                            onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
                          />
                        </div>

                        <div className="space-y-1 flex flex-col justify-end">
                          <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 dark:text-slate-300 cursor-pointer pb-2">
                            <input
                              type="checkbox"
                              checked={newLessonIsPreview}
                              onChange={(e) => setNewLessonIsPreview(e.target.checked)}
                              className="h-4 w-4 rounded text-[#0B2D5B]"
                            />
                            <span>إتاحة المعاينة</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddLessonToUnit(unit.id)}
                          className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black cursor-pointer"
                        >
                          حفظ الدرس
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveUnitIdForLesson(null)}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons List */}
                  <div className="space-y-2">
                    {unit.lessons.length > 0 ? (
                      unit.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] flex items-center justify-center font-bold shrink-0">
                              {lesson.lessonType === "Video" ? (
                                <Video className="h-4 w-4" />
                              ) : lesson.lessonType === "PDF" ? (
                                <File className="h-4 w-4" />
                              ) : (
                                <HelpCircle className="h-4 w-4" />
                              )}
                            </div>

                            <div>
                              <span className="font-extrabold text-[#0B2D5B] dark:text-white">{lesson.title}</span>
                              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-2 pt-0.5">
                                <span>المدة: {lesson.duration} دقيقة</span>
                                {lesson.isPreview && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">• متاحة للمعاينة</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(unit.id, lesson.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="حذف الدرس"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                        لا توجد دروس مضافة في هذه الوحدة بعد
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center gap-2 hover:bg-[#F58220] transition-colors cursor-pointer"
              >
                <span>المعاينة والنشر النهائي</span>
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Final Production Review & Instant Publish */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl"
          >
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">
                ملخص البرنامج التعليمي ومراجعة النشر
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">عنوان البرنامج:</span>
                  <span className="font-black text-[#0B2D5B] dark:text-white">{title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">رسوم الاشتراك:</span>
                  <span className="font-black text-emerald-600">{isFree ? "مجاني" : `${price} ج.م`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">عدد الوحدات المنهجية:</span>
                  <span className="font-black text-[#0B2D5B] dark:text-white">{units.length} وحدات</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">إجمالي عدد الدروس:</span>
                  <span className="font-black text-[#0B2D5B] dark:text-white">{totalLessonsCount} درس مضاف</span>
                </div>
                {thumbnail && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">صورة غلاف البرنامج:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">تم الرفع بنجاح</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                تعديل المنهج
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinishCourse}
                className="flex-1 h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 hover:bg-[#F58220] transition-colors"
              >
                <span>{isSubmitting ? "جاري الاعتماد والحفظ..." : "اعتماد ونشر البرنامج التعليمي"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseBuilderWizard;
