"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bell,
  Check,
  Code2,
  Award,
  Building2,
} from "lucide-react";
import { CustomInput } from "./custom-input";
import { PrimaryButton } from "./primary-button";
import { AuthCard } from "./auth-card";

const systemsList = [
  { id: "general", title: "التعليم العام", desc: "المناهج الحكومية المصرية المعتمدة", icon: "🏛️" },
  { id: "azhari", title: "التعليم الأزهري الشريف", desc: "المناهج الشرعية والعلمية للأزهر الشريف", icon: "🕌" },
  { id: "baccalaureate", title: "نظام البكالوريا الجديد", desc: "النظام التعليمي الحديث والمعتمد للثانوية", icon: "🎓" },
];

const stagesList = [
  { id: "cs_track", title: "مسار علوم الحاسب والتكنولوجيا", sub: "جميع المراحل (برمجة، AI، شبكات)", icon: "💻", isFeatured: true },
  { id: "baccalaureate", title: "نظام البكالوريا الجديد", sub: "شهادة البكالوريا الدولية والعامة", icon: "📜", isFeatured: true },
  { id: "secondary3", title: "الصف الثالث الثانوي", sub: "الثانوية العامة والأزهرية", icon: "🎓" },
  { id: "secondary2", title: "الصف الثاني الثانوي", sub: "المرحلة الثانوية", icon: "📚" },
  { id: "secondary1", title: "الصف الأول الثانوي", sub: "المرحلة الثانوية", icon: "📖" },
  { id: "prep", title: "المرحلة الإعدادية", sub: "الصف 1 - 3 إعدادي (عام وأزهري)", icon: "🎒" },
  { id: "primary", title: "المرحلة الابتدائية", sub: "الصف 4 - 6 ابتدائي (عام وأزهري)", icon: "✏️" },
];

const streamsList = [
  { id: "computer_science", title: "مسار علوم الحاسب والذكاء الاصطناعي", desc: "برمجة، خوارزميات، AI، شبكات" },
  { id: "scientific_science", title: "علمي علوم", desc: "أحياء، كيمياء، فيزياء، جيولوجيا" },
  { id: "scientific_math", title: "علمي رياضة", desc: "رياضيات محضية وتطبيقية، فيزياء" },
  { id: "literary", title: "أدبي", desc: "تاريخ، جغرافيا، فلسفة، علم نفس" },
  { id: "azhari_sharia", title: "شريعة وأصول دين (أزهري)", desc: "فقه، تفسير، حديث، توحيد، قرآن" },
];

const availableSubjects = [
  "علوم الحاسب والبرمجة",
  "الذكاء الاصطناعي وتطبيقاته",
  "الأنظمة الرقمية والأمن السيبراني",
  "اللغة العربية",
  "الفيزياء",
  "الكيمياء",
  "الأحياء",
  "الرياضيات التطبيقية",
  "اللغة الإنجليزية",
  "الفقه والعلوم الشرعية (أزهري)",
  "البكالوريا - المهارات البحثية والرقمية",
  "التاريخ والجغرافيا",
];

import { toast } from "react-hot-toast";

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [role, setRole] = React.useState<"student" | "parent">("student");
  const [system, setSystem] = React.useState<"general" | "azhari" | "baccalaureate">("general");
  const [stage, setStage] = React.useState("cs_track");
  const [stream, setStream] = React.useState("computer_science");
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([
    "علوم الحاسب والبرمجة",
    "الذكاء الاصطناعي وتطبيقاته",
    "الرياضيات التطبيقية",
  ]);
  const [studyHours, setStudyHours] = React.useState(4);
  const [targetScore, setTargetScore] = React.useState(95);
  const [notifications, setNotifications] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsCompleted(true);
    toast.success("تم إعداد مسارك التعليمي بنجاح! مرحباً بك في EduSphere 🎉");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (isCompleted) {
    return (
      <AuthCard className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="h-20 w-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          تم إعداد مسارك التعليمي بنجاح! 🎉
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
          مرحباً بك في منصة EduSphere. نقوم الآن بتخصيص خطتك الدراسية ومحتوى علوم الحاسب والبكالوريا...
        </p>
        <div className="flex justify-center items-center gap-2 text-xs font-semibold text-[#0B2D5B] dark:text-[#F58220] animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>جاري التوجيه إلى الصفحة الرئيسية...</span>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
          <span>الخطوة {currentStep} من 4</span>
          <span>
            {currentStep === 1 && "الهوية ونظام التعليم"}
            {currentStep === 2 && "المرحلة والمسار"}
            {currentStep === 3 && "المواد والأهداف"}
            {currentStep === 4 && "تأكيد الإعدادات"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-[#0F274D] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0B2D5B] to-[#F58220] rounded-full"
            initial={{ width: "25%" }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Role & System Selection */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-right"
          >
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white mb-1">
                نظام التعليم والهوية
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                اختر نظام التعليم لنجهز لك المحتوى التخصصي المناسب
              </p>
            </div>

            {/* Role buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  role === "student"
                    ? "border-[#0B2D5B] dark:border-[#F58220] bg-[#0B2D5B]/5 dark:bg-[#F58220]/15 font-bold"
                    : "border-slate-200 dark:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🎓</span>
                  {role === "student" && <CheckCircle2 className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />}
                </div>
                <div className="mt-2 text-xs font-bold text-[#0B2D5B] dark:text-white">طالب</div>
              </button>

              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                  role === "parent"
                    ? "border-[#0B2D5B] dark:border-[#F58220] bg-[#0B2D5B]/5 dark:bg-[#F58220]/15 font-bold"
                    : "border-slate-200 dark:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                  {role === "parent" && <CheckCircle2 className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />}
                </div>
                <div className="mt-2 text-xs font-bold text-[#0B2D5B] dark:text-white">ولي أمر</div>
              </button>
            </div>

            {/* System selector (عام / أزهري / بكالوريا) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                اختر نظام التعليم الخاص بك:
              </label>
              <div className="space-y-2">
                {systemsList.map((sys) => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => setSystem(sys.id as any)}
                    className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                      system === sys.id
                        ? "border-[#F58220] bg-[#F58220]/10 font-bold"
                        : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sys.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">
                          {sys.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {sys.desc}
                        </div>
                      </div>
                    </div>
                    {system === sys.id && <CheckCircle2 className="h-4 w-4 text-[#F58220]" />}
                  </button>
                ))}
              </div>
            </div>

            <PrimaryButton
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full mt-4"
              leftIcon={<ArrowLeft className="h-5 w-5" />}
            >
              متابعة
            </PrimaryButton>
          </motion.div>
        )}

        {/* STEP 2: Academic Stage & Stream */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-right"
          >
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white mb-1">
                المرحلة والمسار العلمي
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                يشمل منهج علوم الحاسب ونظام البكالوريا الجديد
              </p>
            </div>

            {/* Stages Scroll Container */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {stagesList.map((stg) => (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => {
                    setStage(stg.id);
                    if (stg.id === "cs_track") setStream("computer_science");
                  }}
                  className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    stage === stg.id
                      ? "border-[#0B2D5B] dark:border-[#F58220] bg-[#0B2D5B]/10 dark:bg-[#F58220]/20 font-bold shadow-sm"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{stg.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <span>{stg.title}</span>
                        {stg.isFeatured && (
                          <span className="text-[10px] bg-[#F58220] text-white px-2 py-0.5 rounded-full font-extrabold">
                            جديد
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {stg.sub}
                      </div>
                    </div>
                  </div>
                  {stage === stg.id && <CheckCircle2 className="h-4 w-4 text-[#0B2D5B] dark:text-[#F58220]" />}
                </button>
              ))}
            </div>

            {/* Streams selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                اختر المسار التخصصي:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {streamsList.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStream(st.id)}
                    className={`p-2.5 rounded-xl border text-right transition-all ${
                      stream === st.id
                        ? "border-[#F58220] bg-[#F58220]/10 text-[#F58220] font-bold"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold">{st.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{st.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="w-1/3"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                السابق
              </PrimaryButton>
              <PrimaryButton
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-2/3"
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                متابعة
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Favorite Subjects & Goals */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-right"
          >
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white mb-1">
                المواد التخصصية والأهداف
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                اختر مواد مسارك الأكاديمي وحدد هدفك اليومي
              </p>
            </div>

            {/* Subjects Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                اختر موادك الدراسية (تتضمن علوم الحاسب والأزهر والبكالوريا):
              </label>
              <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#0B2D5B] dark:bg-[#F58220] text-white shadow-sm"
                          : "bg-slate-100 dark:bg-[#0F274D] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Target Slider */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">ساعات المذاكرة والبرمجة اليومية</span>
                <span className="text-[#F58220] text-sm font-extrabold">{studyHours} ساعات / يوم</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full accent-[#F58220] cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">النسبة المئوية المستهدفة</span>
                <span className="text-[#0B2D5B] dark:text-[#F58220] text-sm font-extrabold">{targetScore}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={100}
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full accent-[#0B2D5B] dark:accent-[#F58220] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="w-1/3"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                السابق
              </PrimaryButton>
              <PrimaryButton
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-2/3"
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                متابعة
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Preferences & Summary */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-right"
          >
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white mb-1">
                ملخص مسارك التعليمي
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                تأكد من التفاصيل قبل البدء
              </p>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">نظام التعليم:</span>
                <span className="font-bold text-[#0B2D5B] dark:text-white">
                  {systemsList.find((s) => s.id === system)?.title}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">المرحلة:</span>
                <span className="font-bold text-[#0B2D5B] dark:text-white">
                  {stagesList.find((s) => s.id === stage)?.title}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">المسار التخصصي:</span>
                <span className="font-bold text-[#F58220]">
                  {streamsList.find((s) => s.id === stream)?.title}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">المواد المحددة:</span>
                <span className="font-bold text-[#0B2D5B] dark:text-[#F58220]">
                  {selectedSubjects.length} مواد
                </span>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#0B2D5B] dark:text-[#F58220]" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تفعيل تذكيرات البرمجة والمذاكرة
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5 accent-[#F58220] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="w-1/3"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                السابق
              </PrimaryButton>
              <PrimaryButton
                type="button"
                onClick={handleFinish}
                isLoading={isSubmitting}
                className="w-2/3"
                leftIcon={<Sparkles className="h-5 w-5" />}
              >
                إكمال الإعداد والبدء
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
}

export default OnboardingWizard;
