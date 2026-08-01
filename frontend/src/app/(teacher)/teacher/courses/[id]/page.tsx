"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  PlusCircle,
  Edit,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  FolderPlus,
  Video,
  AlertCircle,
  X,
  ExternalLink,
  DollarSign,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/api";
import { FileUploader } from "@/components/common/file-uploader";
import { TipTapEditor } from "@/components/common/tiptap-editor";

interface CourseData {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  price?: number;
  isFree?: boolean;
  status?: "Published" | "Draft" | "Archived" | "Pending";
  level?: string;
  thumbnail?: string;
  teacher?: any;
  createdAt?: string;
}

interface UnitItem {
  _id: string;
  id?: string;
  title: string;
  order: number;
}

interface LessonItem {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  content?: string;
  unitId?: any;
  sectionId?: any;
  courseId?: any;
  lessonType?: "Video" | "Audio" | "PDF" | "Quiz" | "Assignment" | "Text" | string;
  duration?: number;
  videoUrl?: string;
  audioUrl?: string;
  attachmentUrl?: string;
  isPreview?: boolean;
  isPublished?: boolean;
  order?: number;
}

export default function SingleCourseManagePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = String(params?.id || "");

  // Main Data States
  const [course, setCourse] = React.useState<CourseData | null>(null);
  const [units, setUnits] = React.useState<UnitItem[]>([]);
  const [lessons, setLessons] = React.useState<LessonItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Active Tab: "curriculum" | "details" | "students"
  const [activeTab, setActiveTab] = React.useState<"curriculum" | "details" | "students">("curriculum");

  // Course Edit Form State
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editPrice, setEditPrice] = React.useState<number>(450);
  const [editIsFree, setEditIsFree] = React.useState(false);
  const [editLevel, setEditLevel] = React.useState("جميع المراحل الدراسية");
  const [editThumbnail, setEditThumbnail] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<"Published" | "Draft" | "Archived">("Published");
  const [isSavingCourse, setIsSavingCourse] = React.useState(false);

  // Quick Unit Modal State
  const [isUnitModalOpen, setIsUnitModalOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<UnitItem | null>(null);
  const [unitTitle, setUnitTitle] = React.useState("");
  const [isSavingUnit, setIsSavingUnit] = React.useState(false);

  // Inline Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = React.useState(false);
  const [targetUnitForLesson, setTargetUnitForLesson] = React.useState<string>("");
  const [editingLesson, setEditingLesson] = React.useState<LessonItem | null>(null);

  const [lessonTitle, setLessonTitle] = React.useState("");
  const [lessonType, setLessonType] = React.useState<string>("Video");
  const [lessonDuration, setLessonDuration] = React.useState<number>(15);
  const [lessonVideoUrl, setLessonVideoUrl] = React.useState("");
  const [lessonAudioUrl, setLessonAudioUrl] = React.useState("");
  const [lessonAttachmentUrl, setLessonAttachmentUrl] = React.useState("");
  const [lessonContent, setLessonContent] = React.useState("");
  const [lessonIsPreview, setLessonIsPreview] = React.useState(false);
  const [isSavingLesson, setIsSavingLesson] = React.useState(false);

  // Media Preview Modal State
  const [previewMedia, setPreviewMedia] = React.useState<LessonItem | null>(null);

  // Load Course, Units, and Lessons
  const fetchAllCourseData = React.useCallback(async () => {
    if (!courseId) return;
    try {
      setIsLoading(true);

      // 1. Course Details
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseObj = courseRes.data?.data || courseRes.data;
      setCourse(courseObj);

      // Populate Edit Form
      setEditTitle(courseObj.title || "");
      setEditDescription(courseObj.description || "");
      setEditPrice(courseObj.price ?? 450);
      setEditIsFree(Boolean(courseObj.isFree));
      setEditLevel(courseObj.level || "جميع المراحل الدراسية");
      setEditThumbnail(courseObj.thumbnail || "");
      setEditStatus(courseObj.status || "Published");

      const realCourseId = courseObj._id || courseObj.id || courseId;

      // 2. Units
      const unitsRes = await api.get(`/units?courseId=${realCourseId}`);
      const rawUnits = unitsRes.data?.data;
      const unitList: UnitItem[] = Array.isArray(rawUnits)
        ? rawUnits
        : Array.isArray(rawUnits?.units)
        ? rawUnits.units
        : Array.isArray(unitsRes.data)
        ? unitsRes.data
        : [];
      const sortedUnits = unitList.sort((a, b) => (a.order || 1) - (b.order || 1));
      setUnits(sortedUnits);

      // 3. Lessons: Fetch per unit (guarantees student view parity) + course level fallback
      const lessonsMap = new Map<string, LessonItem>();

      // A. Fetch per unit (guarantees student view parity)
      for (const u of sortedUnits) {
        const uId = u._id || u.id;
        if (!uId) continue;
        try {
          const uLessonsRes = await api.get(`/lessons?unitId=${uId}&limit=100`);
          const rawUL = uLessonsRes.data?.data?.lessons || uLessonsRes.data?.data || uLessonsRes.data || [];
          if (Array.isArray(rawUL)) {
            rawUL.forEach((l: LessonItem) => {
              const lId = l._id || l.id || "";
              if (lId) {
                lessonsMap.set(lId, { ...l, unitId: l.unitId || uId });
              }
            });
          }
        } catch {
          // ignore
        }
      }

      // B. Fetch at course level for any additional lessons
      try {
        const courseLessonsRes = await api.get(`/lessons?courseId=${realCourseId}&limit=200`);
        const rawCL = courseLessonsRes.data?.data?.lessons || courseLessonsRes.data?.data || courseLessonsRes.data || [];
        if (Array.isArray(rawCL)) {
          rawCL.forEach((l: LessonItem) => {
            const lId = l._id || l.id || "";
            if (lId && !lessonsMap.has(lId)) {
              lessonsMap.set(lId, l);
            }
          });
        }
      } catch {
        // ignore
      }

      setLessons(Array.from(lessonsMap.values()));
    } catch (err) {
      console.error("Failed to load course details:", err);
      toast.error("تعذر تحميل بيانات الكورس والمنهج");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  React.useEffect(() => {
    fetchAllCourseData();
  }, [fetchAllCourseData]);

  // Save Course Details
  const handleSaveCourseDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    setIsSavingCourse(true);
    toast.loading("جاري حفظ بيانات الكورس والغلاف...", { id: "save-course" });

    try {
      const payload = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        price: editIsFree ? 0 : Number(editPrice) || 0,
        isFree: editIsFree,
        level: editLevel,
        thumbnail: editThumbnail || undefined,
        status: editStatus,
      };

      const res = await api.patch(`/courses/${courseId}`, payload);
      const updated = res.data?.data || res.data;
      setCourse(updated);

      toast.success("تم حفظ وتحديث بيانات الكورس بنجاح", { id: "save-course" });
    } catch (err: any) {
      console.error("Save course error:", err);
      toast.error(err?.response?.data?.message || "تعذر حفظ التعديلات", { id: "save-course" });
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Unit Modal Handlers
  const handleOpenAddUnit = () => {
    setEditingUnit(null);
    setUnitTitle("");
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (unit: UnitItem) => {
    setEditingUnit(unit);
    setUnitTitle(unit.title);
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle.trim() || !courseId) return;

    setIsSavingUnit(true);
    toast.loading("جاري حفظ الوحدة التعليمية...", { id: "save-unit" });

    try {
      if (editingUnit) {
        // Edit existing unit
        const uId = editingUnit._id || editingUnit.id;
        const res = await api.patch(`/units/${uId}`, { title: unitTitle.trim() });
        const updated = res.data?.data || res.data;
        setUnits((prev) => prev.map((u) => ((u._id || u.id) === uId ? { ...u, title: unitTitle.trim() } : u)));
        toast.success("تم تعديل اسم الوحدة بنجاح", { id: "save-unit" });
      } else {
        // Add new unit
        const res = await api.post("/units", {
          title: unitTitle.trim(),
          courseId,
          order: units.length + 1,
        });
        const created = res.data?.data || res.data;
        setUnits((prev) => [...prev, created]);
        toast.success("تم إضافة الوحدة التعليمية بنجاح", { id: "save-unit" });
      }
      setIsUnitModalOpen(false);
    } catch (err: any) {
      console.error("Save unit error:", err);
      toast.error(err?.response?.data?.message || "تعذر حفظ الوحدة", { id: "save-unit" });
    } finally {
      setIsSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: string, title: string) => {
    if (!window.confirm(`هل أنت متاكد من حذف الوحدة "${title}"؟`)) return;

    toast.loading("جاري حذف الوحدة...", { id: "delete-unit" });
    try {
      await api.delete(`/units/${unitId}`);
      setUnits((prev) => prev.filter((u) => (u._id || u.id) !== unitId));
      toast.success(`تم حذف الوحدة "${title}"`, { id: "delete-unit" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر حذف الوحدة", { id: "delete-unit" });
    }
  };

  // Lesson Modal Handlers
  const handleOpenAddLesson = (unitId: string) => {
    setEditingLesson(null);
    setTargetUnitForLesson(unitId);
    setLessonTitle("");
    setLessonType("Video");
    setLessonDuration(15);
    setLessonVideoUrl("");
    setLessonAudioUrl("");
    setLessonAttachmentUrl("");
    setLessonContent("");
    setLessonIsPreview(false);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    const uId = typeof lesson.unitId === "object" ? lesson.unitId?._id || lesson.unitId?.id : lesson.unitId;
    setTargetUnitForLesson(uId || "");
    setLessonTitle(lesson.title || "");
    setLessonType(lesson.lessonType || "Video");
    setLessonDuration(lesson.duration || 15);
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonAudioUrl((lesson as any).audioUrl || "");
    setLessonAttachmentUrl(lesson.attachmentUrl || "");
    setLessonContent(lesson.content || "");
    setLessonIsPreview(Boolean(lesson.isPreview));
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !courseId) return;

    setIsSavingLesson(true);
    toast.loading("جاري حفظ الدرس...", { id: "save-lesson-modal" });

    try {
      let finalUnitId = targetUnitForLesson;
      if (!finalUnitId) {
        // Auto-create a unit if none selected
        const uRes = await api.post("/units", { title: "الوحدة الأولى: تمهيد", courseId, order: 1 });
        const createdU = uRes.data?.data || uRes.data;
        finalUnitId = createdU._id || createdU.id;
      }

      const payload = {
        title: lessonTitle.trim(),
        courseId,
        unitId: finalUnitId,
        sectionId: finalUnitId,
        lessonType,
        content: lessonContent.trim() || undefined,
        duration: Number(lessonDuration) || 15,
        videoUrl: lessonVideoUrl.trim() || undefined,
        audioUrl: lessonAudioUrl.trim() || undefined,
        attachmentUrl: lessonAttachmentUrl.trim() || undefined,
        isPreview: lessonIsPreview,
        isPublished: true,
      };

      if (editingLesson) {
        const lId = editingLesson._id || editingLesson.id;
        const res = await api.patch(`/lessons/${lId}`, payload);
        const updated = res.data?.data || res.data;
        setLessons((prev) => prev.map((l) => ((l._id || l.id) === lId ? { ...l, ...payload } : l)));
        toast.success("تم تحديث بيانات الدرس بنجاح", { id: "save-lesson-modal" });
      } else {
        const res = await api.post("/lessons", payload);
        const created = res.data?.data || res.data;
        setLessons((prev) => [...prev, created]);
        toast.success("تم إضافة الدرس بنجاح", { id: "save-lesson-modal" });
      }

      setIsLessonModalOpen(false);
    } catch (err: any) {
      console.error("Save lesson error:", err);
      toast.error(err?.response?.data?.message || "تعذر حفظ الدرس", { id: "save-lesson-modal" });
    } finally {
      setIsSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!window.confirm(`هل أنت متاكد من حذف الدرس "${title}"؟`)) return;

    toast.loading("جاري حذف الدرس...", { id: "delete-lesson-modal" });
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => (l._id || l.id) !== lessonId));
      toast.success(`تم حذف درس "${title}"`, { id: "delete-lesson-modal" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر حذف الدرس", { id: "delete-lesson-modal" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-right dir-rtl max-w-5xl mx-auto pb-12">
        <div className="h-24 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
        <div className="h-96 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 rounded-3xl bg-white dark:bg-[#0F274D] text-center space-y-4 max-w-lg mx-auto dir-rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على هذا الكورس</h2>
        <p className="text-xs text-slate-400">تأكد من معرف الكورس في الرابط أو قم بالعودة لصفحة الكورسات</p>
        <Link href="/teacher/courses" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F58220] text-white text-xs font-bold">
          <ArrowRight className="h-4 w-4" />
          <span>العودة للكورسات</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right dir-rtl max-w-5xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220]">
                {course.level || "جميع المراحل"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  course.status === "Published"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                {course.status === "Published" ? "منشور ومتاح للطلاب" : "مسودة / قيد المراجعة"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
              تعديل وإدارة: {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              سعر الاشتراك: <strong className="text-[#F58220]">{course.isFree ? "مجاني" : `${course.price} ج.م`}</strong> | 
              عدد الوحدات: <strong>{units.length}</strong> | 
              إجمالي الدروس: <strong>{lessons.length}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/teacher/courses")}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
              <span>رجوع للكورسات</span>
            </button>

            <a
              href={`/courses/${course._id || course.id}?preview=true`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl border border-[#1E73D8]/30 bg-[#1E73D8]/10 text-[#1E73D8] hover:bg-[#1E73D8] hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>معاينة كما يراه الطالب ↗</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`pb-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "curriculum"
                ? "border-[#F58220] text-[#F58220]"
                : "border-transparent text-slate-500 hover:text-[#0B2D5B] dark:hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>أقسام الوحدات والدروس ({lessons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "details"
                ? "border-[#F58220] text-[#F58220]"
                : "border-transparent text-slate-500 hover:text-[#0B2D5B] dark:hover:text-white"
            }`}
          >
            <Edit className="h-4 w-4" />
            <span>بيانات الكورس والغلاف</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`pb-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "students"
                ? "border-[#F58220] text-[#F58220]"
                : "border-transparent text-slate-500 hover:text-[#0B2D5B] dark:hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>إحصائيات الطلاب والاشتراكات</span>
          </button>

          {/* Sections Management Link — navigates to dedicated /sections page */}
          <Link
            href={`/teacher/courses/${courseId}/sections`}
            className="pb-3 px-4 text-xs font-black border-b-2 border-transparent text-slate-500 hover:text-[#0B2D5B] dark:hover:text-white hover:border-[#F58220] transition-all flex items-center gap-2 shrink-0"
          >
            <Layers className="h-4 w-4" />
            <span>إدارة الأقسام (متقدم)</span>
          </Link>
        </div>
      </div>

      {/* TAB 1: Curriculum Management (Units & Lessons) */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          {/* Header Action Row */}
          <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">هيكلية المنهج والدروس</h2>
              <p className="text-xs text-slate-400">قم بتنظيم الوحدات التعليمية وإضافة الدروس والفيديوهات التابعة لكل وحدة</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenAddUnit}
                className="px-4 py-2.5 rounded-2xl bg-[#0B2D5B] hover:bg-[#153e75] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FolderPlus className="h-4 w-4 text-[#F58220]" />
                <span>+ إضافة وحدة تعليمية جديدة</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAddLesson(units[0]?._id || units[0]?.id || "")}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 transition-all cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ إضافة درس جديد</span>
              </button>
            </div>
          </div>

          {/* Units and Lessons Structure */}
          {units.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-center space-y-4 shadow-sm">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">لا توجد وحدات تعليمية بعد</h3>
                <p className="text-xs text-slate-400">قم بإضافة الوحدة الأولى لتتمكن من تنظيم الدروس والمذكرات داخلها</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddUnit}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F58220] text-white text-xs font-bold shadow-md shadow-[#F58220]/20"
              >
                <FolderPlus className="h-4 w-4" />
                <span>إنشاء الوحدة الأولى الآن</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {units.map((unit) => {
                const uId = String(unit._id || unit.id || "");

                // Filter lessons for this unit (exact match with populated or string IDs)
                const unitLessons = lessons.filter((les) => {
                  const getObjId = (val: any) => {
                    if (!val) return "";
                    if (typeof val === "object") return String(val._id || val.id || "");
                    return String(val);
                  };

                  const lUnitId = getObjId(les.unitId);
                  const lSecId = getObjId(les.sectionId);

                  return (lUnitId !== "" && lUnitId === uId) || (lSecId !== "" && lSecId === uId);
                });

                return (
                  <div
                    key={uId}
                    className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden"
                  >
                    {/* Unit Header */}
                    <div className="p-5 bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 rounded-xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center text-xs font-black">
                          {unit.order || 1}
                        </span>
                        <div>
                          <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
                            الوحدة: {unit.title}
                          </h3>
                          <div className="text-[11px] text-slate-400">
                            عدد الدروس: <strong className="text-[#0B2D5B] dark:text-white">{unitLessons.length}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAddLesson(uId)}
                          className="px-3 py-1.5 rounded-xl bg-[#F58220]/10 text-[#F58220] hover:bg-[#F58220] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>إضافة درس للوحدة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditUnit(unit)}
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                          title="تعديل اسم الوحدة"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUnit(uId, unit.title)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="حذف الوحدة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Unit Lessons Body */}
                    <div className="p-5 space-y-3">
                      {unitLessons.length === 0 ? (
                        <div className="p-8 rounded-3xl bg-slate-50/60 dark:bg-white/[0.01] border-2 border-dashed border-slate-200/80 dark:border-white/10 text-center space-y-3 flex flex-col items-center justify-center">
                          <div className="h-12 w-12 rounded-2xl bg-[#0B2D5B]/5 dark:bg-white/5 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">
                              لا توجد دروس مضافة في هذه الوحدة بعد
                            </h4>
                            <p className="text-[11px] text-slate-400 font-semibold">
                              قم بإضافة المحتوى التعليمي والدروس المرئية أو الصوتية داخل هذه الوحدة
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenAddLesson(uId)}
                            className="px-5 py-2.5 rounded-2xl bg-[#F58220]/10 hover:bg-[#F58220] text-[#F58220] hover:text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>إضافة الدرس الأول في هذه الوحدة</span>
                          </button>
                        </div>
                      ) : (
                        unitLessons.map((les) => {
                          const lId = les._id || les.id || "";
                          return (
                            <div
                              key={lId}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-4 hover:border-[#1E73D8]/40 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center shrink-0">
                                  {les.lessonType === "Video" || les.videoUrl ? (
                                    <PlayCircle className="h-5 w-5" />
                                  ) : les.lessonType === "PDF" || les.attachmentUrl ? (
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                  ) : (
                                    <BookOpen className="h-5 w-5 text-amber-500" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">
                                      {les.title}
                                    </span>
                                    {les.isPreview && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600">
                                        معاينة مجانية
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    المدة: {les.duration || 15} دقيقة | النوع: {les.lessonType || "Video"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {(les.videoUrl || les.attachmentUrl) && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewMedia(les)}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#F58220] transition-colors"
                                    title="معاينة الفيديو أو الملحق"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditLesson(les)}
                                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                                  title="تعديل الدرس"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(lId, les.title)}
                                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  title="حذف الدرس"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Course Details & Cover */}
      {activeTab === "details" && (
        <form onSubmit={handleSaveCourseDetails} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <Edit className="h-5 w-5 text-[#F58220]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">تعديل بيانات الكورس وغلافه الرسمي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">عنوان الكورس *</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            {/* Level / Stage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">المرحلة الدراسية</label>
              <select
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
              >
                <option value="جميع المراحل الدراسية">جميع المراحل الدراسية</option>
                <option value="المرحلة الثانوية العامة">المرحلة الثانوية العامة</option>
                <option value="المرحلة الإعدادية">المرحلة الإعدادية</option>
                <option value="علوم الحاسب والجامعة">علوم الحاسب والجامعة</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">حالة النشر</label>
              <select
                value={editStatus}
                onChange={(e: any) => setEditStatus(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] cursor-pointer"
              >
                <option value="Published">منشور ومتاح للطلاب (Published)</option>
                <option value="Draft">مسودة غير منشورة (Draft)</option>
                <option value="Archived">مؤرشف (Archived)</option>
              </select>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 md:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span>رسوم وخطط الاشتراك</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsFree}
                    onChange={(e) => setEditIsFree(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#F58220]"
                  />
                  <span>برنامج مفتوح ومجاني بالكامل</span>
                </label>
              </div>

              {!editIsFree && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">سعر الاشتراك (بالجنية المصري)</label>
                  <input
                    type="number"
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value) || 0)}
                    className="w-full sm:w-60 h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Uploader */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">صورة غلاف البرنامج الرسمية</label>
              <FileUploader
                category="image"
                folder="courses/thumbnails"
                label="اختر صورة الغلاف الرسمية"
                value={editThumbnail}
                onChange={(url) => setEditThumbnail(url)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">وصف المنهج والمخرجات التعليمية</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="submit"
              disabled={isSavingCourse}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black shadow-lg shadow-[#F58220]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSavingCourse ? "جاري التحديث..." : "حفظ وتثبيت تعديلات الكورس"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Students & Analytics */}
      {activeTab === "students" && (
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
            <Users className="h-5 w-5 text-[#1E73D8]" />
            <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">إحصائيات الطلاب والاشتراكات</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <div className="text-xl font-black text-[#0B2D5B] dark:text-white">1 طالب</div>
              <div className="text-xs font-semibold text-slate-400">إجمالي الطلاب المشتركين</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <div className="text-xl font-black text-emerald-600">{course.isFree ? "0 ج.م" : `${course.price || 450} ج.م`}</div>
              <div className="text-xs font-semibold text-slate-400">إجمالي إيرادات الكورس</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <div className="text-xl font-black text-[#F58220]">100%</div>
              <div className="text-xs font-semibold text-slate-400">نسبة التفاعل والاستمرار</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add/Edit Unit Modal */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-md w-full text-right dir-rtl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                  <FolderPlus className="h-5 w-5 text-[#F58220]" />
                  {editingUnit ? "تعديل اسم الوحدة التعليمية" : "إضافة وحدة تعليمية جديدة"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  قم بتسمية الوحدة المنهجية لتنظيم الدروس والفيديوهات التابعة لها
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUnitModalOpen(false)}
                className="p-2.5 rounded-2xl hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                  عنوان الوحدة المنهجية *
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  placeholder="مثال: الوحدة الثانية: مهارات التحليل المتقدم"
                  required
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingUnit}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isSavingUnit ? "جاري الحفظ..." : "حفظ الوحدة الآن"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-2xl w-full text-right dir-rtl animate-in fade-in zoom-in-95 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#F58220]" />
                  {editingLesson ? "تعديل بيانات الدرس الحالي" : "إضافة درس جديد وتخصيص محتواه"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  قم بإدخال بيانات الدرس، رفع ملفات الفيديوهات أو الملاحظات، وتعيين الوحدة المستهدفة
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="p-2.5 rounded-2xl hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Unit Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                  الوحدة التعليمية المستهدفة *
                </label>
                <select
                  value={targetUnitForLesson}
                  onChange={(e) => setTargetUnitForLesson(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
                >
                  {units.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      الوحدة {u.order}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                  عنوان الدرس المنهجي *
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="مثال: الدرس 03: التطبيقات العملية وحل المعادلات"
                  required
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Lesson Type & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                    نوع المحتوى والوسيط
                  </label>
                  <select
                    value={lessonType}
                    onChange={(e: any) => setLessonType(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] cursor-pointer"
                  >
                    <option value="Video">فيديو (Video)</option>
                    <option value="Audio">تسجيل صوتي (Audio)</option>
                    <option value="PDF">مستند (PDF)</option>
                    <option value="Text">مقال نصي (Text)</option>
                    <option value="Quiz">اختبار (Quiz)</option>
                    <option value="Assignment">واجب دراسي (Assignment)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                    المدة التقديرية (بالدقائق)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(Number(e.target.value) || 0)}
                    className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              {/* Video Uploader */}
              {lessonType === "Video" && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                    ملف الفيديو الأصلي
                  </label>
                  <FileUploader
                    category="video"
                    folder="courses/videos"
                    label="رفع فيديو الدرس"
                    helperText="رفع ملف MP4 أو WebM للدرس بحجم حتى 500MB"
                    maxSizeMB={500}
                    value={lessonVideoUrl}
                    onChange={(url) => setLessonVideoUrl(url)}
                  />
                </div>
              )}

              {/* Audio Uploader */}
              {lessonType === "Audio" && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                    المقطع الصوتي للدرس
                  </label>
                  <FileUploader
                    category="audio"
                    folder="courses/audio"
                    label="رفع التسجيل الصوتي"
                    helperText="رفع ملف صوتي MP3 أو WAV بحجم حتى 50MB"
                    maxSizeMB={50}
                    value={lessonAudioUrl}
                    onChange={(url) => setLessonAudioUrl(url)}
                  />
                </div>
              )}

              {/* Text / Article Content Area with TipTap Rich Text Editor */}
              {(lessonType === "Text" || lessonType === "Article") && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                    محتوى الدرس المقالي النصي (محرر Rich Text احترافي) *
                  </label>
                  <TipTapEditor
                    value={lessonContent}
                    onChange={(html) => setLessonContent(html)}
                    placeholder="اكتب الشرح المفهومي للدرس النصي، العناوين الفرعية، النقاط الرئيسية، وكود التمارين..."
                  />
                </div>
              )}

              {/* Attachment Uploader */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <label className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                  المذكرة / الملحق المرفق بالدرس (اختياري)
                </label>
                <FileUploader
                  category="document"
                  folder="courses/attachments"
                  label="رفع ملحق أو كراسة تمارين"
                  helperText="رفع مستند PDF أو DOCX مرفق بالدرس بحجم حتى 50MB"
                  maxSizeMB={50}
                  value={lessonAttachmentUrl}
                  onChange={(url) => setLessonAttachmentUrl(url)}
                />
              </div>

              {/* Preview Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="checkbox"
                  checked={lessonIsPreview}
                  onChange={(e) => setLessonIsPreview(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#F58220]"
                />
                <span className="text-xs font-bold text-[#0B2D5B] dark:text-white">إتاحة كـ معاينة مجانية (Free Preview)</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <button type="button" onClick={() => setIsLessonModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingLesson}
                  className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#e57518] text-white text-xs font-bold shadow-md shadow-[#F58220]/20 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isSavingLesson ? "جاري الحفظ..." : "حفظ الدرس"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl max-w-2xl w-full space-y-5 text-right dir-rtl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">معاينة: {previewMedia.title}</h3>
              <button type="button" onClick={() => setPreviewMedia(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            {previewMedia.videoUrl && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">فيديو الدرس</label>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <video src={previewMedia.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {previewMedia.attachmentUrl && (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  <span className="text-xs font-black text-[#0B2D5B] dark:text-white">مذكرة الدرس المرفقة</span>
                </div>
                <a href={previewMedia.attachmentUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  <span>فتح المستند ↗</span>
                </a>
              </div>
            )}

            <div className="pt-2 text-left">
              <button type="button" onClick={() => setPreviewMedia(null)} className="px-6 py-2.5 rounded-xl bg-slate-100 text-xs font-bold">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
