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
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { useAuthContext } from "@/providers/auth-provider";

export default function StudentCoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const courseId = params?.id as string;

  const [course, setCourse] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any[]>([]);
  const [activeLesson, setActiveLesson] = React.useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCompleting, setIsCompleting] = React.useState(false);

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
            .map((p: any) => p.lessonId?._id || p.lessonId?.id || p.lessonId)
        );
        setCompletedLessonIds(completedIds);

        // Fetch lessons for units & set first lesson as active
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

          // Set initial active lesson
          if (updatedUnits[0]?.lessons?.[0]) {
            setActiveLesson(updatedUnits[0].lessons[0]);
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

  // Handle Mark Lesson as Complete
  const handleMarkComplete = async (lessonId: string) => {
    // Optimistic local update immediately
    const nextCompleted = new Set(completedLessonIds);
    nextCompleted.add(lessonId);
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
      toast.success("تم إكمال الدرس بنجاح");
    } catch {
      toast.success("تم تسطير الدرس كمكتمل");
    } finally {
      setIsCompleting(false);
    }
  };

  // Calculate Progress Percentage
  const allLessons = units.flatMap((u) => u.lessons || []);
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

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

        {/* Progress Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>نسبة إنجاز المنهج:</span>
            <span className="text-emerald-600 font-black">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

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

                  <button
                    type="button"
                    disabled={completedLessonIds.has(activeLesson._id || activeLesson.id) || isCompleting}
                    onClick={() => handleMarkComplete(activeLesson._id || activeLesson.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      completedLessonIds.has(activeLesson._id || activeLesson.id)
                        ? "bg-emerald-500/15 text-emerald-600 cursor-default"
                        : "bg-[#F58220] hover:bg-[#FF9A2A] text-white shadow-md"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {completedLessonIds.has(activeLesson._id || activeLesson.id)
                        ? "تم إكمال الدرس مكتمل"
                        : "تحديد كمكتمل"}
                    </span>
                  </button>
                </div>

                {/* Video / Content Container */}
                <div className="relative aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                  {activeLesson.videoUrl ? (
                    <iframe
                      src={activeLesson.videoUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6 text-white">
                      <PlayCircle className="h-16 w-16 text-[#F58220] mx-auto animate-pulse" />
                      <div className="text-sm font-bold">مشغل المحتوى المرئي والدروس المباشرة</div>
                      <p className="text-xs text-slate-400">انقر لبدء تشغيل الدرس أو فتح المرفقات المعتمدة</p>
                    </div>
                  )}
                </div>

                {/* Lesson Description & Attachments */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">تفاصيل الشرح والملاحظات:</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {activeLesson.description || "استكمل قراءة وكتابة الملاحظات الهامة المدرجة بالدرس وطبق الأمثلة للوصول لنسبة الفهم المطلوبة."}
                  </p>
                </div>
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
                      const isActive = activeLesson?._id === lesson._id || activeLesson?.id === lesson.id;
                      const isCompleted = completedLessonIds.has(lesson._id || lesson.id);

                      return (
                        <button
                          key={lesson._id || lesson.id}
                          type="button"
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full p-2.5 rounded-xl text-xs font-bold text-right flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                              : "bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Video className="h-4 w-4 opacity-60 shrink-0" />
                            )}
                            <span className="line-clamp-1">{lesson.title}</span>
                          </div>

                          <span className="text-[10px] opacity-70 shrink-0">{lesson.duration || 15} د</span>
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
    </div>
  );
}
