"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Lock,
  PlayCircle,
  Video,
  Volume2,
  FileDown,
  Sparkles,
  GraduationCap,
  Award,
  Printer,
  Share2,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/services/api";
import { useAuthContext } from "@/providers/auth-provider";
import { useStudent } from "@/hooks/useStudent";
import { CertificateCard } from "@/features/dashboard";

export default function StudentCoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const { profile } = useStudent();
  const courseId = params?.id as string;

  const [course, setCourse] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any[]>([]);
  const [activeLesson, setActiveLesson] = React.useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [showCertModal, setShowCertModal] = React.useState(false);

  // Student full name for certificate
  const studentName = React.useMemo(() => {
    const active = profile || user;
    if (active?.firstName || active?.lastName) {
      return `${active.firstName || ""} ${active.lastName || ""}`.trim();
    }
    return "Rabea Shaban ibrahim Mustafa";
  }, [profile, user]);

  // Fetch Course, Units, Lessons & Progress
  React.useEffect(() => {
    if (!courseId) return;

    const fetchClassroomData = async () => {
      try {
        setIsLoading(true);
        const [courseRes, unitsRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/units?courseId=${courseId}&limit=100`),
          api.get(`/progress/course/${courseId}`).catch(() => ({ data: { data: { progressLogs: [] } } })),
        ]);

        const fetchedCourse = courseRes.data?.data || courseRes.data;
        const fetchedUnits = unitsRes.data?.data?.units || unitsRes.data?.data || [];
        setCourse(fetchedCourse);
        setUnits(fetchedUnits);

        // Extract completed lessons from progressLogs
        const progressData = progressRes.data?.data || {};
        const progressList: any[] = progressData.progressLogs || progressData || [];
        const completedIds = new Set<string>(
          progressList
            .filter((p: any) => p.completed === true)
            .map((p: any) => String(p.lessonId?._id || p.lessonId?.id || p.lessonId))
        );
        setCompletedLessonIds(completedIds);

        // Fetch lessons for units & set initial active lesson
        if (fetchedUnits.length > 0) {
          const updatedUnits = [...fetchedUnits];
          for (let u of updatedUnits) {
            try {
              const lessonsRes = await api.get(`/lessons?unitId=${u._id || u.id}&limit=100`);
              u.lessons = lessonsRes.data?.data?.lessons || lessonsRes.data?.data || [];
            } catch {
              u.lessons = [];
            }
          }
          setUnits(updatedUnits);

          // Set initial active lesson to the first UNCOMPLETED (unlocked) lesson where student left off
          const flat = updatedUnits.flatMap((u) => u.lessons || []);
          if (flat.length > 0) {
            const firstUncompleted = flat.find((l: any) => !completedIds.has(String(l._id || l.id)));
            if (firstUncompleted) {
              setActiveLesson(firstUncompleted);
            } else {
              // All completed -> resume at last lesson
              setActiveLesson(flat[flat.length - 1]);
            }
          }
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "تعذر تحميل محتوى الكورس");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassroomData();
  }, [courseId]);

  // Flat list of all lessons in exact sequential order
  const allLessons = React.useMemo(() => {
    return units.flatMap((u) => u.lessons || []);
  }, [units]);

  // Determine if a lesson is unlocked
  const isLessonUnlocked = React.useCallback(
    (lessonId: string) => {
      const index = allLessons.findIndex((l: any) => String(l._id || l.id) === String(lessonId));
      if (index <= 0) return true; // First lesson is always unlocked
      const prevLesson = allLessons[index - 1];
      if (!prevLesson) return true;
      const prevId = String(prevLesson._id || prevLesson.id);
      return completedLessonIds.has(prevId);
    },
    [allLessons, completedLessonIds]
  );

  // Handle Mark Lesson as Complete
  const handleMarkComplete = async (lessonId: string) => {
    const strId = String(lessonId);
    const nextCompleted = new Set(completedLessonIds);
    nextCompleted.add(strId);
    setCompletedLessonIds(nextCompleted);

    try {
      setIsCompleting(true);
      await api.post("/progress", {
        courseId,
        lessonId,
        completed: true,
        watchTime: 0,
        videoProgress: 100,
      });

      // Find current lesson index and auto-advance to next lesson if available
      const currentIndex = allLessons.findIndex((l: any) => String(l._id || l.id) === strId);
      if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        setActiveLesson(nextLesson);
        toast.success("تهانينا! تم إكمال الدرس وفتح الدرس التالي 🚀");
      } else {
        // Course 100% finished! Auto open certificate modal
        setShowCertModal(true);
        toast.success("🎉 مبروك! لقد أكملت 100% من المسار وتخرجت بنجاح!");
      }
    } catch {
      toast.success("تم تسجيل الدرس كمكتمل 🚀");
    } finally {
      setIsCompleting(false);
    }
  };

  // Calculate Progress Percentage based on real total & completed counts
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
  const isCourseFullyCompleted = progressPercent === 100 || (totalLessonsCount > 0 && completedCount === totalLessonsCount);

  // Unique Certificate Code
  const certCode = React.useMemo(() => {
    return `EDU-2026-${(courseId || "").substring(0, 6).toUpperCase()}`;
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] flex items-center justify-center p-8">
        <div className="h-12 w-12 border-4 border-[#0B2D5B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] flex flex-col items-center justify-center p-8 space-y-4 text-right dir-rtl">
        <BookOpen className="h-16 w-16 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">لم يتم العثور على الكورس</h2>
        <Link href="/dashboard/courses" className="px-6 py-2 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold">
          العودة لكورساتي
        </Link>
      </div>
    );
  }

  const activeLessonUnlocked = activeLesson ? isLessonUnlocked(activeLesson._id || activeLesson.id) : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07132b] text-right dir-rtl space-y-6 pb-16 p-4 sm:p-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/courses" className="text-slate-400 hover:text-[#0B2D5B] text-xs font-bold">
              كورساتي
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#0B2D5B] dark:text-white font-extrabold text-xs">{course.title}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#0B2D5B] dark:text-white">
            قاعة التعلم التفاعلية
          </h1>
        </div>

        {/* Progress Bar & Certificate Quick Trigger */}
        <div className="w-full sm:w-80 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>إنجاز الدروس الحقيقي: ({completedCount}/{totalLessonsCount})</span>
            <span className="text-emerald-600 font-black">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isCourseFullyCompleted && (
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <GraduationCap className="h-4 w-4" />
              <span>عرض وحفظ شهادة التخرج المعتمدة 📜</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 100% Course Completion Graduation Banner & Side-by-Side Certificate ─ */}
      {isCourseFullyCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#0B2D5B] text-white border-2 border-amber-400/40 shadow-2xl overflow-hidden space-y-6"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Side 1: Compact Scaled Official Printable Certificate Document Frame (6 Cols) */}
            <div className="lg:col-span-6 xl:col-span-6 w-full flex justify-center">
              <div
                id="printable-certificate"
                className="relative bg-[#FCFBF7] text-[#0B2D5B] rounded-2xl p-4 sm:p-6 border-[6px] sm:border-[8px] border-[#0B2D5B] shadow-xl space-y-3.5 overflow-hidden text-center select-none w-full max-w-lg"
              >
                {/* Gold Inner Border Ornament */}
                <div className="absolute inset-2 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
                <div className="absolute inset-3 border border-amber-500/20 rounded-lg pointer-events-none" />

                {/* Corner Flourish Accents */}
                <div className="absolute top-3 right-3 w-5 h-5 border-t-3 border-r-3 border-amber-500/80" />
                <div className="absolute top-3 left-3 w-5 h-5 border-t-3 border-l-3 border-amber-500/80" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-3 border-r-3 border-amber-500/80" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-3 border-l-3 border-amber-500/80" />

                {/* Background Watermark Seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.png" alt="EduSphere Watermark" className="h-48 w-auto object-contain" />
                </div>

                {/* Certificate Brand Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-amber-500/30 pb-2.5 relative z-10">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-mark.png"
                      alt="EduSphere Logo"
                      className="h-8 sm:h-10 w-auto object-contain drop-shadow-md shrink-0"
                    />
                    <div className="text-right">
                      <h2 className="text-xs sm:text-base font-black tracking-tight text-[#0B2D5B] flex items-center gap-1">
                        <span>EduSphere</span>
                        <span className="text-[#F58220] font-bold text-[9px]">منصة التعليم الذكي</span>
                      </h2>
                      <p className="text-[8px] font-bold text-slate-500">
                        مؤسسة برمجية وأكاديمية مرخصة للتعليم الرقمي والمدمج
                      </p>
                    </div>
                  </div>

                  <div className="text-left font-mono text-[10px] font-bold text-slate-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <div className="text-[8px] text-amber-700 font-sans font-black">رمز التوثيق الرسمي</div>
                    <span className="text-[#0B2D5B] font-black">{certCode}</span>
                  </div>
                </div>

                {/* Main Title Banner */}
                <div className="space-y-0.5 relative z-10 pt-0.5">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-800 text-[10px] sm:text-xs font-black border border-amber-500/30">
                    CERTIFICATE OF ACADEMIC EXCELLENCE
                  </span>
                  <h1 className="text-lg sm:text-2xl font-black text-[#0B2D5B] tracking-wide pt-0.5">
                    شهادة إتمام وتفوق أكاديمي
                  </h1>
                </div>

                {/* Awarding Statement */}
                <div className="space-y-2 relative z-10 max-w-md mx-auto py-0.5">
                  <p className="text-xs font-semibold text-slate-600">
                    تُمنح هذه الشهادة الأكاديمية المعتمدة رسمياً من إدارة منصة <strong>EduSphere</strong> إلى الطالب/ة:
                  </p>

                  <div className="py-0.5">
                    <div className="student-name text-lg sm:text-2xl font-bold text-[#0B2D5B] border-b-2 border-amber-500/60 inline-block px-6 py-0.5 font-serif tracking-wide whitespace-nowrap max-w-full">
                      {studentName}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    تقديراً لاستيفائه بنجاح واقتدار لكافة المتطلبات والأجزاء التطبيقية والاختبارات المعتمدة في الدورة التعليمية المتخصصة:
                  </p>

                  <div className="py-0.5">
                    <div className="course-title-pill text-xs sm:text-base font-black text-[#F58220] px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 inline-block">
                      « {course?.title || "أساسيات البرمجة وتطوير الويب"} »
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-600 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                      بتقدير عام: <strong>ممتاز (100%)</strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      تاريخ الإصدار: <strong>{new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}</strong>
                    </span>
                  </div>
                </div>

                {/* Signatures & Official Verified Seal Grid */}
                <div className="grid grid-cols-3 gap-2 items-end pt-3 border-t border-amber-500/30 relative z-10">
                  {/* Teacher Signature (Right) */}
                  <div className="text-center space-y-0.5">
                    <div className="h-6 border-b border-dashed border-slate-400 flex items-end justify-center pb-0.5 font-serif text-[11px] font-bold text-[#0B2D5B]">
                      {course?.teacherName || "Eng Rabea Shaban"}
                    </div>
                    <div className="text-[10px] font-black text-[#0B2D5B]">{course?.teacherName || "Eng Rabea Shaban"}</div>
                    <div className="text-[8px] font-bold text-slate-500">المعلم والمحاضر المسؤول</div>
                  </div>

                  {/* Gold Verified Seal (Center) */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex flex-col items-center justify-center shadow-md border-2 border-white ring-2 ring-amber-500/50 relative p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-mark.png" alt="EduSphere Stamp" className="h-6 w-auto object-contain drop-shadow-md" />
                      <Sparkles className="h-2 w-2 text-amber-100 absolute top-0.5 right-0.5 animate-pulse" />
                    </div>
                    <div className="text-[8px] font-black text-amber-800 mt-0.5">الختم الأكاديمي المعتمد</div>
                  </div>

                  {/* Executive Signature (Left) */}
                  <div className="text-center space-y-0.5">
                    <div className="h-6 border-b border-dashed border-slate-400 flex items-end justify-center pb-0.5 font-serif text-[11px] font-bold text-[#0B2D5B]">
                      EduSphere Board
                    </div>
                    <div className="text-[10px] font-black text-[#0B2D5B]">إدارة منصة EduSphere</div>
                    <div className="text-[8px] font-bold text-slate-500">الشؤون الأكاديمية والتوثيق</div>
                  </div>
                </div>

                {/* Footer QR Verification Bar */}
                <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-200/60 relative z-10">
                  <div className="flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? `${window.location.origin}/verify/certificate/${certCode}`
                          : `http://localhost:3000/verify/certificate/${certCode}`
                      )}`}
                      alt="Certificate QR Code Verification"
                      className="cert-qr-code h-12 w-12 sm:h-14 sm:w-14 rounded-lg border-2 border-[#0B2D5B] bg-white p-0.5 shadow-xs shrink-0"
                    />
                  </div>

                  <div className="text-left space-y-0.5 font-bold">
                    <div className="text-[#0B2D5B]">EduSphere Official Verification</div>
                    <div className="text-[7px] text-slate-400">جميع الحقوق محفوظة للمنصة التعليمية © 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side 2: Info Header & Action Buttons Column (6 Cols) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-4 text-right flex flex-col justify-center">
              
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-inner">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400" />
                  <span>تهانينا! لقد تخرجت بنجاح 🎓</span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-snug">
                  مبروك الإنجاز 100%! تم إصدار شهادة التخرج الرسمية باسمك
                </h2>

                <p className="text-xs font-medium text-slate-300 leading-relaxed">
                  لقد أكملت كافة الدروس والتطبيقات المنهجية بنجاح تام. الشهادة المعتمدة معروضة جانباً وتتضمن كافة أختام التوثيق الرسمية ورمز الـ QR الخاص بك.
                </p>
              </div>

              {/* Action Buttons arranged vertically in flex column */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>طباعة / تنزيل PDF الشهادة المعتمدة</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success(`تم نسخ رابط التوثيق للشهادة: ${certCode}`)}
                  className="w-full py-2.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>مشاركة الشهادة</span>
                </button>

                <Link
                  href="/dashboard/certificates"
                  className="w-full py-2.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/20 transition-all text-center block"
                >
                  <GraduationCap className="h-4 w-4 inline-block ml-1" />
                  <span>مركز شهاداتي المسجلة</span>
                </Link>
              </div>

              {/* Verification Code Box */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">رمز التوثيق المعتمد:</span>
                <span className="font-mono font-bold text-amber-400 dir-ltr">{certCode}</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Main Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Lesson Content Player (Left/Main - 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            
            {activeLesson ? (
              <>
                {/* Lesson Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#1E73D8] text-[10px] font-black">
                      {activeLesson.lessonType || "فيديو تعليمي"}
                    </span>
                    <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {activeLessonUnlocked ? (
                    <button
                      type="button"
                      disabled={completedLessonIds.has(String(activeLesson._id || activeLesson.id)) || isCompleting}
                      onClick={() => handleMarkComplete(activeLesson._id || activeLesson.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        completedLessonIds.has(String(activeLesson._id || activeLesson.id))
                          ? "bg-emerald-500/15 text-emerald-600 cursor-default"
                          : "bg-[#F58220] hover:bg-[#FF9A2A] text-white shadow-md"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {completedLessonIds.has(String(activeLesson._id || activeLesson.id))
                          ? "تم إكمال الدرس مكتمل ✅"
                          : "تحديد كمكتمل لفتح التالي 🔒"}
                      </span>
                    </button>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-amber-500" />
                      <span>مغلق — أفي بتنفيذ الدرس السابق أولاً</span>
                    </span>
                  )}
                </div>

                {/* Locked Lesson State vs Unlocked Content Renderer */}
                {!activeLessonUnlocked ? (
                  <div className="p-12 text-center rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-4 text-amber-200">
                    <div className="h-16 w-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-inner">
                      <Lock className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-amber-300">الدرس الحالي مغلق 🔒</h3>
                      <p className="text-xs text-amber-200/80 font-medium max-w-md mx-auto">
                        يجب عليك اختيار الدرس السابق وتحديده كمكتمل لفتح هذا الدرس والانتقال في المسار التعليمي.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Multi-Format Lesson Content Renderer */
                  (() => {
                    const type = String(activeLesson.lessonType || "").toLowerCase();
                    const videoUrl = activeLesson.videoUrl;
                    const audioUrl = activeLesson.audioUrl || (type === "audio" ? videoUrl : undefined);
                    const attachmentUrl = activeLesson.attachmentUrl;
                    const content = activeLesson.content;

                    const isVideoNative = videoUrl && (
                      videoUrl.toLowerCase().endsWith(".mp4") ||
                      videoUrl.toLowerCase().endsWith(".webm") ||
                      videoUrl.toLowerCase().endsWith(".mov") ||
                      videoUrl.includes("r2.dev") ||
                      videoUrl.includes("cloudflarestorage.com")
                    );

                    // 1. VIDEO CONTENT
                    if (videoUrl && (type === "video" || isVideoNative || !type || type === "live")) {
                      return (
                        <div className="relative aspect-video w-full bg-[#050B14] rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-xl">
                          {isVideoNative ? (
                            <video
                              src={videoUrl}
                              controls
                              autoPlay
                              onEnded={() => {
                                const currentId = String(activeLesson._id || activeLesson.id);
                                if (!completedLessonIds.has(currentId)) {
                                  toast.success("انتهى الفيديو! تم تسجيل إكمال الدرس وفتح الدرس التالي تلقائياً 🎬🚀");
                                  handleMarkComplete(currentId);
                                }
                              }}
                              controlsList="nodownload"
                              className="w-full h-full object-contain outline-none"
                            />
                          ) : (
                            <iframe
                              src={videoUrl}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                      );
                    }

                    // 2. AUDIO CONTENT
                    if (audioUrl || type === "audio") {
                      return (
                        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B2D5B] to-[#0A2244] text-white space-y-6 border border-white/10 shadow-xl">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-[#F58220]/20 text-[#F58220] flex items-center justify-center shrink-0 border border-[#F58220]/30 shadow-inner">
                              <Volume2 className="h-7 w-7" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-black text-white">{activeLesson.title}</h3>
                              <p className="text-xs text-slate-300 font-semibold">
                                تسجيل صوتي عالي الجودة • مدة الاستماع: {activeLesson.duration || 15} دقيقة
                              </p>
                            </div>
                          </div>

                          {audioUrl ? (
                            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                              <audio
                                src={audioUrl}
                                controls
                                autoPlay
                                onEnded={() => {
                                  const currentId = String(activeLesson._id || activeLesson.id);
                                  if (!completedLessonIds.has(currentId)) {
                                    toast.success("انتهى المقطع الصوتي! تم تسجيل إكمال الدرس وفتح الدرس التالي تلقائياً 🎧🚀");
                                    handleMarkComplete(currentId);
                                  }
                                }}
                                className="w-full h-10 outline-none"
                              />
                            </div>
                          ) : (
                            <p className="text-xs text-amber-300">جارٍ تجهيز التسجيل الصوتي لرفعه لهذا الدرس...</p>
                          )}
                        </div>
                      );
                    }

                    // 3. TEXT / ARTICLE CONTENT
                    if (type === "text" || type === "article" || content) {
                      return (
                        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-5 shadow-xs">
                          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4 text-[#F58220]">
                            <FileText className="h-5 w-5" />
                            <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                              محتوى الدرس النصي والشرح المنهجي
                            </h3>
                          </div>

                          <div
                            className="prose dark:prose-invert max-w-none text-xs sm:text-sm font-semibold leading-relaxed text-[#0B2D5B] dark:text-slate-100 dir-rtl text-right space-y-3"
                            dangerouslySetInnerHTML={{
                              __html: content || activeLesson.description || "<p>لا يوجد محتوى نصي مكتوب لهذا الدرس بعد.</p>",
                            }}
                          />
                        </div>
                      );
                    }

                    // 4. PDF / DOCUMENT CONTENT
                    if (type === "pdf" || attachmentUrl) {
                      return (
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-5">
                          <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-[#1E73D8]">
                              <FileDown className="h-5 w-5" />
                              <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                                مذكرة ومستند الدرس (PDF)
                              </h3>
                            </div>
                            {attachmentUrl && (
                              <a
                                href={attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-[#1E73D8] hover:bg-[#155ab0] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
                              >
                                <Download className="h-4 w-4" />
                                <span>تحميل المذكرة ↗</span>
                              </a>
                            )}
                          </div>

                          {attachmentUrl && attachmentUrl.toLowerCase().includes(".pdf") ? (
                            <div className="h-[550px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 shadow-inner">
                              <iframe src={attachmentUrl} className="w-full h-full border-0" />
                            </div>
                          ) : (
                            <div className="p-8 text-center space-y-2 text-slate-400">
                              <FileText className="h-10 w-10 mx-auto opacity-50" />
                              <p className="text-xs font-bold">ملف المستند جاهز للتحميل عبر الزر أعلاه</p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // DEFAULT FALLBACK
                    return (
                      <div className="text-center space-y-3 p-12 rounded-2xl bg-slate-900 text-white">
                        <PlayCircle className="h-14 w-14 text-[#F58220] mx-auto animate-pulse" />
                        <div className="text-sm font-bold">قاعة التعلم والدروس التفاعلية</div>
                        <p className="text-xs text-slate-400">انقر على الدرس المطلوب لعرض المحتوى المنهجي</p>
                      </div>
                    );
                  })()
                )}

                {/* Lesson Description & Global Attachment Bar */}
                {activeLessonUnlocked && (
                  <div className="space-y-4 pt-2">
                    {activeLesson.description && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">ملخص وتوجيهات الدرس:</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {activeLesson.description}
                        </p>
                      </div>
                    )}

                    {/* Attachment Download Bar */}
                    {activeLesson.attachmentUrl && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#1E73D8]/10 text-[#1E73D8] flex items-center justify-center shrink-0">
                            <FileDown className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#0B2D5B] dark:text-white block">
                              ملحق ومذكرة إضافية مرفقة بالدرس
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">
                              يمكنك تنزيل المذكرة لمتابعة الشرح
                            </span>
                          </div>
                        </div>

                        <a
                          href={activeLesson.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#1E73D8] hover:bg-[#155ab0] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>تنزيل الملحق</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 space-y-3 text-slate-400">
                <BookOpen className="h-12 w-12 mx-auto" />
                <div className="text-sm font-bold">اختر درساً من القائمة المنهجية لعرض المحتوى</div>
              </div>
            )}

          </div>
        </div>

        {/* Units & Lessons Sidebar (Right - 1 Col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <BookOpen className="h-4 w-4 text-[#F58220]" />
              <span>فصول ووحدات المنهج ({units.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {units.map((unit, uIdx) => (
                <div key={unit._id || uIdx} className="space-y-2">
                  <div className="text-xs font-black text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                    {uIdx + 1}. {unit.title}
                  </div>

                  <div className="space-y-1 pr-2">
                    {unit.lessons?.map((lesson: any) => {
                      const lessonStrId = String(lesson._id || lesson.id);
                      const isActive = String(activeLesson?._id || activeLesson?.id) === lessonStrId;
                      const isCompleted = completedLessonIds.has(lessonStrId);
                      const unlocked = isLessonUnlocked(lessonStrId);

                      return (
                        <button
                          key={lessonStrId}
                          type="button"
                          onClick={() => {
                            if (!unlocked) {
                              toast.error("عفواً، يجب عليك اختيار الدرس السابق وتحديده كمكتمل أولاً لفتح هذا الدرس 🔒");
                              return;
                            }
                            setActiveLesson(lesson);
                          }}
                          className={`w-full p-2.5 rounded-xl text-xs font-bold text-right flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm font-black"
                              : !unlocked
                              ? "bg-slate-100/60 dark:bg-white/5 opacity-60 cursor-not-allowed text-slate-400"
                              : "bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : !unlocked ? (
                              <Lock className="h-4 w-4 text-amber-500 shrink-0" />
                            ) : (
                              <Video className="h-4 w-4 text-[#F58220] shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <span className="text-[10px] opacity-75 shrink-0 font-bold">
                            {!unlocked ? "مغلق 🔒" : `${lesson.duration || 15} د`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ── Official Certificate Preview & Print Modal ──────────────────────── */}
      <AnimatePresence>
        {showCertModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-right space-y-4 shadow-2xl relative border border-white/10 dir-rtl my-8"
            >
              {/* Close & Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">
                    شهادة التخرج المعتمدة رسمياً من منصة EduSphere
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Printable Official Document */}
              <div
                id="modal-certificate-preview"
                className="relative bg-[#FCFBF7] text-[#0B2D5B] rounded-2xl p-6 sm:p-10 border-[10px] border-[#0B2D5B] shadow-2xl space-y-6 overflow-hidden text-center select-none"
              >
                {/* Gold Borders */}
                <div className="absolute inset-3 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
                <div className="absolute inset-4 border border-amber-500/20 rounded-lg pointer-events-none" />

                {/* Corner Flourishes */}
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-amber-500/80" />
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-amber-500/80" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-amber-500/80" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-amber-500/80" />

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B2D5B] flex items-center gap-1.5">
                      <span>EduSphere</span>
                      <span className="text-[#F58220] font-bold text-xs">المنصة التعليمية الذكية</span>
                    </h2>
                  </div>

                  <div className="text-left font-mono text-xs font-bold text-slate-500 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-700 font-sans font-black">رمز التوثيق المعتمد</div>
                    <span className="text-[#0B2D5B] font-black">{certCode}</span>
                  </div>
                </div>

                {/* Main Title */}
                <div className="space-y-1 relative z-10 pt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-800 text-xs font-black border border-amber-500/30">
                    OFFICIAL CERTIFICATE OF GRADUATION
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] tracking-wide pt-1">
                    شهادة إتمام وتخرج معتمدة
                  </h1>
                </div>

                {/* Award Statement */}
                <div className="space-y-4 relative z-10 max-w-2xl mx-auto py-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    تشهد إدارة منصة <strong>EduSphere</strong> التعليمية بأن الطالب/ة:
                  </p>

                  <div className="py-2">
                    <div className="text-2xl sm:text-3xl font-black text-[#0B2D5B] border-b-2 border-amber-500/60 inline-block px-8 py-1.5 font-serif tracking-wide">
                      {studentName}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    قد أتم بنجاح واقتدار نسبة <strong>100%</strong> واستوفى كافة المتطلبات والأجزاء المنهجية المعتمدة في الكورس:
                  </p>

                  <div className="py-1">
                    <div className="text-lg sm:text-2xl font-black text-[#F58220] px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 inline-block">
                      « {course?.title || "أساسيات البرمجة وتطوير الويب"} »
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                      تقدير الإتمام: <strong>ممتاز (100%)</strong>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                      تاريخ التخرج: <strong>{new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })}</strong>
                    </span>
                  </div>
                </div>

                {/* Seal & Signatures */}
                <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-amber-500/30 relative z-10">
                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif text-sm font-bold text-[#0B2D5B]">
                      {course?.teacherName || "Eng Rabea Shaban"}
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">{course?.teacherName || "Eng Rabea Shaban"}</div>
                    <div className="text-[10px] font-bold text-slate-500">المعلم المحاضر</div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white ring-2 ring-amber-500/50 relative p-2">
                      <Sparkles className="h-5 w-5 text-amber-100 animate-pulse" />
                    </div>
                    <div className="text-[10px] font-black text-amber-800 mt-1">الختم الأكاديمي المعتمد</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 font-serif text-sm font-bold text-[#0B2D5B]">
                      EduSphere Board
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">إدارة المنصة التعليمية</div>
                    <div className="text-[10px] font-bold text-slate-500">مكتب الشؤون الأكاديمية</div>
                  </div>
                </div>

                {/* Footer QR Verification */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-200/60 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? `${window.location.origin}/verify/certificate/${certCode}`
                          : `http://localhost:3000/verify/certificate/${certCode}`
                      )}`}
                      alt="Certificate QR Verification"
                      className="h-12 w-12 rounded-xl border-2 border-[#0B2D5B] bg-white p-1 shadow-sm shrink-0"
                    />
                  </div>

                  <div className="text-left space-y-0.5 font-bold">
                    <div className="text-[#0B2D5B]">EduSphere Official Verification Token</div>
                    <div className="text-[9px] text-slate-400">جميع الحقوق محفوظة للمنصة التعليمية © 2026</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 font-semibold">
                  رمز التحقق المعتمد: <strong className="font-mono text-amber-400">{certCode}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 sm:flex-initial h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>طباعة / تنزيل PDF الشهادة المعتمدة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`تم نسخ رابط التوثيق للشهادة: ${certCode}`)}
                    className="h-11 px-4 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Stylesheet (Enforces Exactly 1 Page Landscape Print/PDF) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape !important;
            margin: 0 !important;
          }
          html, body {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #FCFBF7 !important;
          }
          header, nav, footer, aside, button, iframe, video, .fixed.inset-0 {
            display: none !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate,
          #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 14px 24px !important;
            box-shadow: none !important;
            border: 8px solid #0B2D5B !important;
            background-color: #FCFBF7 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-before: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            z-index: 99999999 !important;
          }
          #printable-certificate h1 {
            font-size: 26px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }
          #printable-certificate h2 {
            font-size: 18px !important;
            margin: 0 !important;
          }
          #printable-certificate .student-name {
            font-size: 22px !important;
            line-height: 1.3 !important;
            white-space: nowrap !important;
            max-width: 95% !important;
          }
          #printable-certificate .course-title-pill {
            font-size: 16px !important;
          }
          #printable-certificate p,
          #printable-certificate span,
          #printable-certificate div {
            font-size: 12px !important;
          }
          #printable-certificate img {
            visibility: visible !important;
            display: inline-block !important;
            opacity: 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-certificate .cert-qr-code {
            width: 54px !important;
            height: 54px !important;
            min-width: 54px !important;
            min-height: 54px !important;
            border-width: 2px !important;
            padding: 2px !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
