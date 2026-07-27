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
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { FileUploader } from "@/components/common/file-uploader";

export function CourseBuilderWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("cs");
  const [stage, setStage] = React.useState("جميع المراحل");
  const [price, setPrice] = React.useState("450");
  const [description, setDescription] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");
  
  const [sections, setSections] = React.useState<string[]>([
    "الوحدة الأولى: أساسيات المنهج والتفكير البرمجي",
    "الوحدة الثانية: التطبيقات العملية والمشاريع",
  ]);
  const [newSectionTitle, setNewSectionTitle] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections([...sections, newSectionTitle.trim()]);
    setNewSectionTitle("");
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleFinishCourse = async () => {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان الكورس أولاً");
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("جاري حفظ بيانات الكورس والوحدات الدراسية...", { id: "create-course" });

      // 1. Create Course in Backend MongoDB
      const payload = {
        title: title.trim(),
        description: description.trim() || "وصف الكورس التعليمي الشامل لطلاب EduSphere",
        price: Number(price) || 0,
        status: "Published",
        level: stage || "جميع المراحل",
        thumbnail: thumbnail || undefined,
      };

      const courseRes = await api.post("/courses", payload);
      const createdCourse = courseRes.data?.data || courseRes.data;
      const courseId = createdCourse._id || createdCourse.id;

      // 2. Create Units / Sections in Backend MongoDB
      if (courseId && sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          try {
            await api.post("/units", {
              title: sections[i],
              courseId,
              order: i + 1,
            });
          } catch (unitErr) {
            console.error("Unit creation notice:", unitErr);
          }
        }
      }

      toast.success("تم إنشاء الكورس والوحدات ونشرهم على المنصة بنجاح! 🎉", { id: "create-course" });
      router.push("/teacher/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء حفظ ونشر الكورس", { id: "create-course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm text-right dir-rtl space-y-6">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div className="text-xs font-black text-slate-500">
          الخطوة {step} من 3:{" "}
          <strong className="text-[#0B2D5B] dark:text-white">
            {step === 1 && "المعلومات الأساسية والغلاف والسعر"}
            {step === 2 && "المنهج الدراسي والأقسام"}
            {step === 3 && "معاينة وتأكيد النشر الفوري"}
          </strong>
        </div>
        <div className="h-2.5 w-48 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#F58220] rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Basic Info, Thumbnail & Price */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الكورس الرئيسي *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الشامل في البرمجة والتفكير الخوارزمي الحديث"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">التصنيف والمسار</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer dark:bg-[#0F274D]"
                >
                  <option value="cs">💻 علوم الحاسب والتكنولوجيا</option>
                  <option value="general">🏫 التعليم العام (الثانوي)</option>
                  <option value="azhari">🕌 الأزهر الشريف</option>
                  <option value="baccalaureate">📜 البكالوريا الدولية</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">سعر الاشتراك (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="450"
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">صورة غلاف الكورس (Thumbnail)</label>
              <FileUploader
                value={thumbnail}
                onChange={(url) => setThumbnail(url)}
                folder="courses"
                label="اختر صورة غلاف الكورس"
                helperText="ارفع صورة غلاف ممتازة تعكس محتوى الكورس"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">وصف الكورس والأهداف التعليمية</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="اكتب شرحاً موجزاً ومحفزاً للطلاب يشرح ما سيتعلمونه والمخرجات النهائية..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  toast.error("يرجى كتابة عنوان الكورس أولاً");
                  return;
                }
                setStep(2);
              }}
              className="px-6 h-11 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-black flex items-center gap-2 hover:bg-[#F58220] transition-colors cursor-pointer"
            >
              <span>الانتقال لبناء الوحدات المنهجية</span>
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
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">إضافة وحدات وفصول المنهج الدراسية</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="عنوان الفصل أو الوحدة الجديدة..."
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="h-11 px-5 rounded-2xl bg-[#F58220] text-white text-xs font-black flex items-center gap-1 cursor-pointer hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة فصل</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-bold"
                >
                  <span className="text-[#0B2D5B] dark:text-white flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span>{sec}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
                <span>المعاينة والنشر الفوري</span>
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Preview & Confirm */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl"
          >
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">العنوان الرئيسي:</span>
                <span className="font-black text-[#0B2D5B] dark:text-white">{title}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">سعر الاشتراك:</span>
                <span className="font-black text-emerald-600">{price} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">عدد الفصول المسجلة:</span>
                <span className="font-black text-[#F58220]">{sections.length} وحدات منهجية</span>
              </div>
              {thumbnail && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">غلاف الكورس:</span>
                  <span className="text-emerald-500 font-bold">تم رفع الغلاف بنجاح 🖼️</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 h-11 rounded-2xl bg-slate-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
              >
                تعديل
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinishCourse}
                className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? "جاري الحفظ والتأكيد..." : "تأكيد ونشر الكورس على المنصة"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseBuilderWizard;
