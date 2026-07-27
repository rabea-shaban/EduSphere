"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Globe,
  Video,
  ShieldCheck,
  Building,
  Calendar,
  FileText,
  Clock,
  Star,
  Award,
  AlertCircle,
  ChevronDown,
  X,
  File,
  Eye,
  RefreshCw,
  Lock,
  HelpCircle,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import teacherService, { TeacherApplicationInput } from "@/services/teacher.service";
import { useAuthContext } from "@/providers/auth-provider";

interface FileUploadState {
  file: File | null;
  url: string;
  name: string;
  size: string;
}

const STORAGE_KEY = "edusphere_teacher_apply_draft";

export default function TeacherApplyPage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStage, setSubmitStage] = React.useState<number>(0); // 1: upload, 2: verify, 3: sending
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [applicationId, setApplicationId] = React.useState<string>("");

  const [autoSaveNotice, setAutoSaveNotice] = React.useState(false);

  // Form Field States
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [nationalId, setNationalId] = React.useState("");

  const [subject, setSubject] = React.useState("");
  const [stage, setStage] = React.useState("الثانوية العامة");
  const [experienceYears, setExperienceYears] = React.useState<number>(5);
  const [currentJob, setCurrentJob] = React.useState("");
  const [bio, setBio] = React.useState("");

  const [degree, setDegree] = React.useState("بكالوريوس التربية / العلوم");
  const [university, setUniversity] = React.useState("");
  const [graduationYear, setGraduationYear] = React.useState<number>(2020);

  // File Uploads
  const [cvFile, setCvFile] = React.useState<FileUploadState>({ file: null, url: "", name: "", size: "" });
  const [nationalIdFront, setNationalIdFront] = React.useState<FileUploadState>({ file: null, url: "", name: "", size: "" });
  const [certificateDoc, setCertificateDoc] = React.useState<FileUploadState>({ file: null, url: "", name: "", size: "" });
  const [demoVideoUrl, setDemoVideoUrl] = React.useState("");

  // Social Links
  const [linkedin, setLinkedin] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  const [youtube, setYoutube] = React.useState("");
  const [website, setWebsite] = React.useState("");

  const [agreed, setAgreed] = React.useState(false);

  // Validation Errors per field
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Accordion open states
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  // Initialize from user object or local draft
  React.useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }

    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.fullName && !user?.fullName) setFullName(parsed.fullName);
        if (parsed.email && !user?.email) setEmail(parsed.email);
        if (parsed.phone && !user?.phone) setPhone(parsed.phone);
        if (parsed.nationalId) setNationalId(parsed.nationalId);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.stage) setStage(parsed.stage);
        if (parsed.experienceYears) setExperienceYears(parsed.experienceYears);
        if (parsed.currentJob) setCurrentJob(parsed.currentJob);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.degree) setDegree(parsed.degree);
        if (parsed.university) setUniversity(parsed.university);
        if (parsed.graduationYear) setGraduationYear(parsed.graduationYear);
        if (parsed.demoVideoUrl) setDemoVideoUrl(parsed.demoVideoUrl);
        if (parsed.linkedin) setLinkedin(parsed.linkedin);
        if (parsed.facebook) setFacebook(parsed.facebook);
        if (parsed.youtube) setYoutube(parsed.youtube);
        if (parsed.website) setWebsite(parsed.website);
        if (parsed.cvUrl) setCvFile({ file: null, url: parsed.cvUrl, name: parsed.cvName || "السيرة الذاتية.pdf", size: "تم الحفظ" });
      }
    } catch {
      // ignore draft parse error
    }
  }, [user]);

  // Auto-save draft effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (fullName || subject || university) {
        const draftData = {
          fullName,
          email,
          phone,
          nationalId,
          subject,
          stage,
          experienceYears,
          currentJob,
          bio,
          degree,
          university,
          graduationYear,
          cvUrl: cvFile.url,
          cvName: cvFile.name,
          demoVideoUrl,
          linkedin,
          facebook,
          youtube,
          website,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
        setAutoSaveNotice(true);
        setTimeout(() => setAutoSaveNotice(false), 2500);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [
    fullName,
    email,
    phone,
    nationalId,
    subject,
    stage,
    experienceYears,
    currentJob,
    bio,
    degree,
    university,
    graduationYear,
    cvFile,
    demoVideoUrl,
    linkedin,
    facebook,
    youtube,
    website,
  ]);

  // Step Progress calculation
  const totalSteps = 5;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  // File Upload Helper
  const processFile = (file: File, setter: React.Dispatch<React.SetStateAction<FileUploadState>>) => {
    if (!file) return;

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("حجم الملف يجب ألا يتجاوز 10 ميجابايت");
      return;
    }

    // Format size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const reader = new FileReader();
    reader.onload = () => {
      setter({
        file,
        url: reader.result as string,
        name: file.name,
        size: sizeInMB,
      });
      toast.success(`تم رفع الملف: ${file.name} 📎`);
    };
    reader.readAsDataURL(file);
  };

  // Validation per step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!fullName.trim() || fullName.trim().split(" ").length < 2) {
        newErrors.fullName = "يرجى إدخال الاسم بالكامل (الثنائي على الأقل).";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        newErrors.email = "يرجى إدخال بريد إلكتروني صحيح.";
      }
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phone.trim() || !phoneRegex.test(phone.trim())) {
        newErrors.phone = "رقم الهاتف المصري يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا.";
      }
      if (nationalId.trim() && !/^[0-9]{14}$/.test(nationalId.trim())) {
        newErrors.nationalId = "الرقم القومي يجب أن يتكون من 14 رقمًا.";
      }
    } else if (stepNumber === 2) {
      if (!subject.trim()) {
        newErrors.subject = "يرجى تحديد أو إدخال المادة التخصصية.";
      }
      if (!stage.trim()) {
        newErrors.stage = "يرجى اختيار المرحلة التعليمية.";
      }
      if (experienceYears < 0) {
        newErrors.experienceYears = "يرجى تحديد سنوات الخبرة بشكل صحيح.";
      }
    } else if (stepNumber === 3) {
      if (!degree.trim()) {
        newErrors.degree = "يرجى اختيار أو إدخال المؤهل العلمي.";
      }
      if (!university.trim()) {
        newErrors.university = "يرجى إدخال اسم الجامعة أو الكلية.";
      }
      if (!graduationYear || graduationYear < 1950 || graduationYear > new Date().getFullYear()) {
        newErrors.graduationYear = "يرجى إدخال سنة تخرج صحيحة.";
      }
    } else if (stepNumber === 4) {
      if (!cvFile.url) {
        newErrors.cvFile = "يرجى رفع السيرة الذاتية بصيغة PDF أو مستند مدعوم.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    if (!agreed) {
      toast.error("يرجى الموافقة والتأكيد على صحة البيانات قبل الإرسال.");
      return;
    }

    const payload: TeacherApplicationInput = {
      fullName,
      email,
      phone,
      nationalId,
      subject,
      stage,
      experienceYears: Number(experienceYears),
      currentJob,
      bio,
      degree,
      university,
      graduationYear: Number(graduationYear),
      profileImage: "",
      nationalIdFront: nationalIdFront.url,
      certificateDoc: certificateDoc.url,
      cvUrl: cvFile.url,
      demoVideoUrl,
      socialLinks: {
        linkedin,
        facebook,
        youtube,
        website,
      },
    };

    try {
      setIsSubmitting(true);
      
      // Stage 1: Uploading files progress animation
      setSubmitStage(1);
      await new Promise((res) => setTimeout(res, 800));

      // Stage 2: Verifying data
      setSubmitStage(2);
      await new Promise((res) => setTimeout(res, 800));

      // Stage 3: Sending API request
      setSubmitStage(3);
      const response = await teacherService.submitApplication(payload);

      // Save ID or generate fallback
      const generatedId = response?._id ? `TCH-2026-${response._id.slice(-4).toUpperCase()}` : `TCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setApplicationId(generatedId);

      // Clear local draft
      localStorage.removeItem(STORAGE_KEY);

      setIsSubmitted(true);
      toast.success("تم إرسال طلبك بنجاح للمراجعة! 🎉");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
      setSubmitStage(0);
    }
  };

  // Steps Header Data
  const stepsList = [
    { id: 1, title: "البيانات الشخصية", icon: User },
    { id: 2, title: "التخصص والخبرة", icon: BookOpen },
    { id: 3, title: "المؤهلات", icon: Building },
    { id: 4, title: "المستندات", icon: FileText },
    { id: 5, title: "المراجعة والإرسال", icon: CheckCircle2 },
  ];

  // FAQ Accordion Data
  const faqs = [
    {
      q: "هل يوجد رسوم للتقديم؟",
      a: "لا، التقديم مجاني بالكامل 100% للانضمام لفريق معلمين منصة EduSphere دون أي تكاليف مادية.",
    },
    {
      q: "كم تستغرق عملية المراجعة والرد؟",
      a: "تستغرق المراجعة الفنية والأكاديمية عادةً من 2 إلى 5 أيام عمل، وسيتم التواصل معك مباشرة عبر البريد الإلكتروني أو الهاتف.",
    },
    {
      q: "هل يمكنني تعديل بيانات الطلب بعد الإرسال؟",
      a: "يمكنك الاستعلام عن حالة الطلب أو التواصل مع فريق الدعم الفني لإرسال مستندات إضافية في حال طلبت اللجنة ذلك.",
    },
    {
      q: "ماذا يحدث في حال عدم قبول الطلب؟",
      a: "يمكنك الاطلاع على سبب عدم القبول الموضح من الإدارة عبر صفحة الاستعلام، وإعادة التقديم لاحقاً بمستندات محدثة.",
    },
    {
      q: "متى أستطيع البدء في رفع الكورسات والدروس؟",
      a: "فور قبول طلبك وتغيير حالة حسابك إلى معلم معتمد، ستفتح لك لوحة تحكم المعلم الشاملة لرفع الدروس وإنشاء الدورات وتحديد الأسعار.",
    },
  ];

  // SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-right transition-colors" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white dark:bg-[#0F274D] rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-center"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/20">
              الحالة: قيد المراجعة ⏳ Pending
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              🎉 تم استلام طلبك بنجاح!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              شكرًا لاهتمامك بالانضمام كمعلم في EduSphere. سيقوم فريق الإدارة بمراجعة طلبك ومستنداتك خلال فترة المراجعة المحددة.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 text-right">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/10">
              <span className="text-slate-400 font-bold">رقم مرجع الطلب:</span>
              <strong className="text-[#F58220] font-black dir-ltr font-mono text-sm">{applicationId}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">مقدم الطلب:</span>
              <strong className="text-[#0B2D5B] dark:text-white font-bold">{fullName}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">المادة المستهدفة:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{subject} ({stage})</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">مدة المراجعة التقديرية:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">2 – 5 أيام عمل</strong>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href="/teacher/status"
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/25 hover:opacity-95 transition-opacity"
            >
              <span>متابعة حالة الطلب</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
            >
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-right transition-colors" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ========================================================== */}
        {/* HERO & TRUST BAR */}
        {/* ========================================================== */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/15 border border-[#F58220]/30 text-[#F58220] px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse text-[#F58220]" />
            <span>انضم إلى نخبة المعلمين والمحاضرين</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2D5B] dark:text-white tracking-tight leading-snug">
            طلب الانضمام كمعلم في EduSphere 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            شارِك خبرتك التعليمية مع آلاف الطلاب عبر منصتنا الذكية. قم بتعبئة نموذج الطلب وإرفاق مؤهلاتك لمراجعتها من إدارة المنصة.
          </p>

          {/* Trust Bar Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>تقييم المعلمين 4.9/5</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold shadow-sm">
              <User className="h-3.5 w-3.5 text-blue-500" />
              <span>+500 معلم معتمد</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-bold shadow-sm">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span>مراجعة خلال 2–5 أيام عمل</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>التقديم مجاني بالكامل</span>
            </span>
          </div>

          <div className="pt-1">
            <Link
              href="/teacher/status"
              className="inline-flex items-center gap-2 text-xs font-black text-[#0B2D5B] dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 px-4 py-2 rounded-2xl transition-all shadow-sm"
            >
              <span>هل قدمت طلباً بالفعل؟ استعلم عن حالة طلبك بالبريد أو الرقم القومي 🔎</span>
            </Link>
          </div>
        </div>

        {/* MAIN LAYOUT: Form (8 cols) + Sticky Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* ========================================================== */}
            {/* PROGRESS BAR & STEPPER CONTAINER */}
            {/* ========================================================== */}
            <div className="bg-white dark:bg-[#0F274D] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg space-y-5">
              
              {/* Top Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <span>اكتمال الطلب</span>
                  {autoSaveNotice && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      تم حفظ المسودة تلقائياً
                    </motion.span>
                  )}
                </span>
                <span className="text-[#F58220] font-bold">{progressPercent}%</span>
              </div>

              {/* Progress Fill Bar */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#F58220] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Stepper Navigation Buttons */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                {stepsList.map((step) => {
                  const Icon = step.icon;
                  const isCurrent = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (isCompleted) setCurrentStep(step.id);
                      }}
                      disabled={!isCompleted && !isCurrent}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all text-center ${
                        isCurrent
                          ? "bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white border border-[#0B2D5B]/20 dark:border-white/20 font-black"
                          : isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer font-bold"
                          : "text-slate-400 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                          isCurrent
                            ? "bg-[#F58220] text-white shadow-md shadow-[#F58220]/30"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-500"
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className="text-[10px] sm:text-xs line-clamp-1 leading-tight">{step.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================== */}
            {/* STEPPER FORM CONTAINER */}
            {/* ========================================================== */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-[#F58220]" />
                        <span>1. البيانات الشخصية وسجل التواصل</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">أدخل معلوماتك الأساسية كما هي مدونة بالمستندات الرسمية</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الاسم الكامل *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="أدخل اسمك الثلاثي أو الرباعي..."
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.fullName ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.fullName && <p className="text-[11px] text-rose-500 font-bold">{errors.fullName}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@domain.com"
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none dir-ltr text-right transition-colors`}
                        />
                        {errors.email && <p className="text-[11px] text-rose-500 font-bold">{errors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">رقم الهاتف (واتساب) *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010XXXXXXXX"
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.phone ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none dir-ltr text-right transition-colors`}
                        />
                        {errors.phone && <p className="text-[11px] text-rose-500 font-bold">{errors.phone}</p>}
                      </div>

                      {/* National ID */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الرقم القومي (اختياري)</label>
                        <input
                          type="text"
                          maxLength={14}
                          value={nationalId}
                          onChange={(e) => setNationalId(e.target.value)}
                          placeholder="14 رقم قومي..."
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.nationalId ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.nationalId && <p className="text-[11px] text-rose-500 font-bold">{errors.nationalId}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Subject & Experience */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#F58220]" />
                        <span>2. التخصص والخبرة الأكاديمية</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">حدد المادة العلمية والمرحلة التعليمية وسنوات خبرتك</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">المادة التخصصية الرئيسية *</label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="مثال: الرياضيات، الفيزياء، علوم الحاسب..."
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.subject ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.subject && <p className="text-[11px] text-rose-500 font-bold">{errors.subject}</p>}
                      </div>

                      {/* Educational Stage */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">المرحلة التعليمية المستهدفة *</label>
                        <select
                          value={stage}
                          onChange={(e) => setStage(e.target.value)}
                          className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] dark:bg-[#0F274D]"
                        >
                          <option value="جميع المراحل التعليمية">🌟 جميع المراحل التعليمية (ابتدائي / إعدادي / ثانوي)</option>
                          <option value="الثانوية العامة">🎓 المرحلة الثانوية والتعليم العام</option>
                          <option value="البكالوريا الجديدة">📜 نظام البكالوريا الجديد</option>
                          <option value="الأزهر الشريف">🕌 التعليم الأزهري الشريف</option>
                          <option value="علوم الحاسب">💻 مسار علوم الحاسب والتكنولوجيا والبرمجة</option>
                          <option value="المرحلة الإعدادية">🎒 المرحلة الإعدادية (الصف الأول - الثالث الإعدادي)</option>
                          <option value="المرحلة الابتدائية">✏️ المرحلة الابتدائية (الصف الرابع - السادس الابتدائي)</option>
                        </select>
                      </div>

                      {/* Experience Years */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">سنوات الخبرة التعليمية *</label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                        />
                      </div>

                      {/* Current Job */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الوظيفة / جهة العمل الحالية</label>
                        <input
                          type="text"
                          value={currentJob}
                          onChange={(e) => setCurrentJob(e.target.value)}
                          placeholder="مثال: معلم أول بمدرسة..."
                          className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نبذة مختصرة عن أسلوبك في الشرح والتدريس</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="اكتب ملخصاً عن أسلوبك التعليمي وإنجازاتك مع الطلاب..."
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Qualifications */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <Building className="h-5 w-5 text-[#F58220]" />
                        <span>3. المؤهلات والدرجات العلمية</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">أدخل معلومات المؤهل الأكاديمي والجامعة</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Degree */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">أعلى مؤهل دراسي *</label>
                        <input
                          type="text"
                          required
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="بكالوريوس / ماجستير / دكتوراه..."
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.degree ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.degree && <p className="text-[11px] text-rose-500 font-bold">{errors.degree}</p>}
                      </div>

                      {/* University */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الجامعة / الكلية *</label>
                        <input
                          type="text"
                          required
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="اسم الجامعة والكلية..."
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.university ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.university && <p className="text-[11px] text-rose-500 font-bold">{errors.university}</p>}
                      </div>

                      {/* Graduation Year */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">سنة التخرج *</label>
                        <input
                          type="number"
                          required
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(Number(e.target.value))}
                          className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border ${
                            errors.graduationYear ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
                          } text-xs font-semibold outline-none transition-colors`}
                        />
                        {errors.graduationYear && <p className="text-[11px] text-rose-500 font-bold">{errors.graduationYear}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Drag & Drop Documents */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <UploadCloud className="h-5 w-5 text-[#F58220]" />
                        <span>4. رفع المستندات (السيرة الذاتية والشهادات)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">تدعم الصيغ: PDF, PNG, JPG, JPEG (الحد الأقصى: 10MB لكل ملف)</p>
                    </div>

                    <div className="space-y-4">
                      {/* CV Drag & Drop Area */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">السيرة الذاتية (CV / PDF) *</label>
                        
                        {!cvFile.url ? (
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) processFile(file, setCvFile);
                            }}
                            className={`p-6 rounded-3xl border-2 border-dashed ${
                              errors.cvFile ? "border-rose-500 bg-rose-50/20" : "border-slate-300 dark:border-white/20 hover:border-[#F58220] bg-slate-50 dark:bg-white/5"
                            } transition-colors text-center space-y-3 relative cursor-pointer`}
                          >
                            <UploadCloud className="h-10 w-10 text-[#F58220] mx-auto animate-bounce" />
                            <div className="space-y-1">
                              <p className="text-xs font-black text-[#0B2D5B] dark:text-white">
                                اسحب السيرة الذاتية وإفلاتها هنا، أو اضغط للاختيار
                              </p>
                              <p className="text-[11px] text-slate-400">PDF, PNG, JPG (حجم أقصى 10MB)</p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) processFile(file, setCvFile);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                  <span>{cvFile.name}</span>
                                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    ✓ تم الرفع
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  الحجم: {cvFile.size}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {cvFile.url && cvFile.url.startsWith("data:") && (
                                <a
                                  href={cvFile.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-white dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:text-[#F58220]"
                                  title="معاينة"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setCvFile({ file: null, url: "", name: "", size: "" })}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                                title="حذف"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {errors.cvFile && <p className="text-[11px] text-rose-500 font-bold">{errors.cvFile}</p>}
                      </div>

                      {/* Demo Video Link & Optional Certificate */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            رابط فيديو لشرح توضيحي (YouTube / Drive)
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={demoVideoUrl}
                              onChange={(e) => setDemoVideoUrl(e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full h-11 pl-4 pr-10 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220] dir-ltr text-right"
                            />
                            <Video className="h-4 w-4 text-slate-400 absolute right-3 top-3.5" />
                          </div>
                        </div>

                        {/* Social Links Quick Add */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">رابط LinkedIn أو القناة</label>
                          <div className="relative">
                            <input
                              type="url"
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              placeholder="https://linkedin.com/in/..."
                              className="w-full h-11 pl-4 pr-10 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220] dir-ltr text-right"
                            />
                            <Globe className="h-4 w-4 text-slate-400 absolute right-3 top-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Summary & Final Review */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                      <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#F58220]" />
                        <span>5. المراجعة النهائية والتأكيد</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">تأكد من صحة بياناتك قبل تقديم الطلب النهائي</p>
                    </div>

                    {/* Summary Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-white/10">
                        <span className="font-bold text-slate-500">الاسم والبريد الإلكتروني:</span>
                        <span className="font-extrabold text-[#0B2D5B] dark:text-white">{fullName} ({email})</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-white/10">
                        <span className="font-bold text-slate-500">رقم الواتساب:</span>
                        <span className="font-extrabold text-[#F58220] dir-ltr">{phone}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-white/10">
                        <span className="font-bold text-slate-500">المادة والمرحلة:</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{subject} - {stage}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-white/10">
                        <span className="font-bold text-slate-500">سنوات الخبرة والمؤهل:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{experienceYears} سنوات | {degree} ({university})</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-500">السيرة الذاتية:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ {cvFile.name || "مرفقة"}</span>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 flex items-center gap-3">
                      <Lock className="h-5 w-5 text-[#0B2D5B] dark:text-blue-400 shrink-0" />
                      <p className="font-bold leading-relaxed">
                        🔒 جميع بياناتك ومستنداتك محفوظة ومشفرة ولن يتم مشاركتها مع أي جهة خارج منصة EduSphere.
                      </p>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-50/60 dark:bg-white/5 border border-[#F58220]/30">
                      <input
                        type="checkbox"
                        id="agree-checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-5 w-5 accent-[#F58220] rounded cursor-pointer mt-0.5"
                      />
                      <label htmlFor="agree-checkbox" className="text-xs font-extrabold text-slate-700 dark:text-slate-200 cursor-pointer leading-relaxed">
                        أقر بأن جميع البيانات والشهادات والمؤهلات المرفقة صحيحة ودقيقة، وأتعهد بالالتزام بمعايير جودة التعليم الخاصة بمنصة EduSphere.
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Multi-step Navigation Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10 gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="h-12 px-6 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>السابق</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="h-12 px-8 rounded-2xl bg-[#0B2D5B] hover:bg-[#1E73D8] text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#0B2D5B]/20 transition-all cursor-pointer"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-sm font-black shadow-xl shadow-[#F58220]/25 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3 text-xs">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>
                          {submitStage === 1 && "رفع المستندات..."}
                          {submitStage === 2 && "التحقق من البيانات..."}
                          {submitStage === 3 && "إرسال الطلب للمراجعة..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span>إرسال الطلب للمراجعة</span>
                        <ArrowLeft className="h-5 w-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ========================================================== */}
          {/* SIDEBAR INFORMATION (Desktop Sticky Card) */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 hidden lg:block sticky top-24 space-y-6">
            <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#F58220]" />
                  <span>ماذا يحدث بعد إرسال الطلب؟</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">خطوات مراجعة اعتماد حساب المعلم في المنصة</p>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4 relative before:absolute before:right-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10 pr-2">
                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white">استلام الطلب</h5>
                    <p className="text-[11px] text-slate-500">حفظ الطلب فوراً وإنشاء رقم مرجعي</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-7 w-7 rounded-full bg-[#0B2D5B] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    🔍
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white">مراجعة البيانات</h5>
                    <p className="text-[11px] text-slate-500">تدقيق التخصص والخبرات الأكاديمية</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-7 w-7 rounded-full bg-[#F58220] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    📄
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white">مراجعة المستندات</h5>
                    <p className="text-[11px] text-slate-500">فحص السيرة الذاتية والشهادات</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-7 w-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    👨‍💼
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white">اعتماد الإدارة</h5>
                    <p className="text-[11px] text-slate-500">قرار اللجنة خلال 2–5 أيام عمل</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    🎉
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-white">تفعيل حساب المعلم</h5>
                    <p className="text-[11px] text-slate-500">فتح لوحة التحكم وبدء إنشاء الكورسات</p>
                  </div>
                </div>
              </div>

              {/* Privacy callout */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                🛡️ نحافظ على خصوصيتك وأمان بياناتك وفق أحدث معايير التشفير والأمان.
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* FAQ ACCORDION SECTION */}
        {/* ========================================================== */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#F58220]">
              <HelpCircle className="h-4 w-4" />
              <span>الأسئلة الشائعة</span>
            </div>
            <h3 className="text-xl font-black text-[#0B2D5B] dark:text-white">
              أسئلة مكررة حول الانضمام لمنصة EduSphere
            </h3>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-bold text-[#0B2D5B] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#F58220] transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
