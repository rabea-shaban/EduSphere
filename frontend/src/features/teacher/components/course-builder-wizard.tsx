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
} from "lucide-react";

export function CourseBuilderWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("cs");
  const [stage, setStage] = React.useState("جميع المراحل");
  const [price, setPrice] = React.useState("450");
  const [description, setDescription] = React.useState("");
  const [sections, setSections] = React.useState<string[]>([
    "الوحدة الأولى: أساسيات التفكير الخوارزمي",
    "الوحدة الثانية: البرمجة بلغة C++ وتطبيقاتها",
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
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsSubmitting(false);
    alert("تم إنشاء الكورس ونشره على منصة EduSphere بنجاح! 🎉");
    router.push("/teacher/courses");
  };

  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm text-right space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div className="text-xs font-bold text-slate-500">
          الخطوة {step} من 3:{" "}
          <strong className="text-[#0B2D5B] dark:text-white">
            {step === 1 && "المعلومات الأساسية والسعر"}
            {step === 2 && "المنهج الدراسي والأقسام"}
            {step === 3 && "معاينة وتأكيد النشر"}
          </strong>
        </div>
        <div className="h-2 w-48 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B2D5B] to-[#F58220] rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان الكورس</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: أسس البرمجة الهيكلية والتطبيقات التفاعلية بلغة C++"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">التصنيف والمسار</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="cs">💻 علوم الحاسب والتكنولوجيا</option>
                  <option value="general">🏫 التعليم العام (ثانوية عامة)</option>
                  <option value="azhari">🕌 الأزهر الشريف</option>
                  <option value="baccalaureate">📜 البكالوريا الجديدة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">سعر الاشتراك (بالجنيه المصري)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="450"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">وصف الكورس والأهداف</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="اكتب شرحاً موجزاً لما سيتعلمه الطالب من هذا الكورس والمخرجات العملية..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 h-11 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#F58220] transition-colors"
            >
              <span>الانتقال للمنهج والأقسام</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">إضافة وحدات وأقسام الكورس</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="اسم الوحدة الدراسية الجديدة..."
                  className="flex-1 h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="h-11 px-4 rounded-xl bg-[#F58220] text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-bold"
                >
                  <span className="text-[#0B2D5B] dark:text-white">{sec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
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
                className="px-6 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 h-11 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#F58220] transition-colors"
              >
                <span>المعاينة والنشر النهائي</span>
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl"
          >
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">العنوان:</span>
                <span className="font-extrabold text-[#0B2D5B] dark:text-white">{title || "كورس علوم الحاسب المتقدم"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">السعر المحدد:</span>
                <span className="font-extrabold text-emerald-600">{price} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">عدد الأقسام:</span>
                <span className="font-extrabold text-[#F58220]">{sections.length} وحدات</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                تعديل
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinishCourse}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? "جاري النشر..." : "تأكيد ونشر الكورس على المنصة"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseBuilderWizard;
