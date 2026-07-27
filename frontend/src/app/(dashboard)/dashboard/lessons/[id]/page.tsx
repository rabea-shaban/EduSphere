"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Download,
  FileText,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { mockLessonDetails } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { studentService } from "@/services/student.service";
import { ApiLesson } from "@/features/dashboard/types/api";
import { toast } from "react-hot-toast";

export default function LessonPlayerPage() {
  const params = useParams();
  const lessonId = (params?.id as string) || "lesson-26";

  const [lesson, setLesson] = React.useState<ApiLesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"attachments" | "notes" | "comments">("attachments");
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState(mockLessonDetails.comments);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const { updateProgress } = useStudent();

  React.useEffect(() => {
    async function fetchLesson() {
      try {
        setIsLoadingLesson(true);
        const data = await studentService.getLessonDetails(lessonId);
        setLesson(data);
      } catch {
        // Fallback to mock if test lesson ID
      } finally {
        setIsLoadingLesson(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    setIsCompleted(true);
    if (lesson) {
      await updateProgress({
        courseId: lesson.courseId,
        lessonId: lesson._id,
        completed: true,
        videoProgress: 100,
      });
    }
    toast.success("تم تحديد الدرس كـ مكتمل وتسجيل التقدم! 🎉");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      {
        id: Date.now().toString(),
        userName: "طالب EduSphere",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        timeAgo: "الآن",
        content: commentText,
        likesCount: 0,
      },
      ...comments,
    ]);
    setCommentText("");
  };

  const displayTitle = lesson?.title || mockLessonDetails.title;
  const displayDescription = lesson?.description || mockLessonDetails.description;
  const displayVideoUrl = lesson?.videoUrl || mockLessonDetails.videoUrl;

  return (
    <div className="space-y-6 text-right">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Link href="/dashboard/courses" className="hover:text-[#F58220]">
            الكورسات
          </Link>
          <span>/</span>
          <span className="text-[#0B2D5B] dark:text-white truncate max-w-xs">{mockLessonDetails.courseTitle}</span>
        </div>

        <button
          type="button"
          onClick={handleMarkComplete}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            isCompleted
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-[#0B2D5B] dark:bg-[#1E73D8] hover:bg-[#F58220] text-white"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isCompleted ? "تم إكمال الدرس 🎉" : "تحديد كـ مكتمل"}</span>
        </button>
      </div>

      {/* Main Video Player Container */}
      <div className="rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isLoadingLesson ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-[#F58220]" />
          ) : (
            <video
              controls
              src={displayVideoUrl}
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
            />
          )}
        </div>
      </div>

      {/* Lesson Details Header */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-white mb-1">
              {displayTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              الدرس {lesson?.order || mockLessonDetails.order} من {mockLessonDetails.totalCourseLessons} | المدة: {lesson?.duration ? `${lesson.duration} دقيقة` : mockLessonDetails.duration}
            </p>
          </div>

          {/* Navigation Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
              <span>الدرس السابق</span>
            </button>
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-[#F58220] text-white text-xs font-bold shadow-md hover:bg-[#ff9a2a] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>الدرس التالي</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-white/10">
          {displayDescription}
        </p>
      </div>

      {/* Tabs for Resources, Notes, Comments */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("attachments")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "attachments"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Download className="h-4 w-4" />
            <span>المرفقات والملفات ({mockLessonDetails.attachments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "notes"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>ملاحظاتي المخصصة</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "comments"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>أسئلة ومناقشات الطلاب ({comments.length})</span>
          </button>
        </div>

        {/* Tab 1: Attachments */}
        {activeTab === "attachments" && (
          <div className="space-y-3">
            {mockLessonDetails.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{att.title}</div>
                    <div className="text-[11px] text-slate-400">الحجم: {att.fileSize}</div>
                  </div>
                </div>
                <a
                  href={att.downloadUrl}
                  className="px-4 py-2 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>تنزيل</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Notes */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <textarea
              defaultValue={mockLessonDetails.notes}
              rows={4}
              placeholder="اكتب ملاحظاتك الشخصية الخاصة بهذا الدرس..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-[#F58220]"
            />
            <button
              type="button"
              onClick={() => toast.success("تم حفظ الملاحظات بنجاح! 📝")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              حفظ الملاحظات
            </button>
          </div>
        )}

        {/* Tab 3: Comments & Discussion */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <form onSubmit={handleAddComment} className="flex gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="طرح سؤال أو مناقشة حول كود الخوارزميات..."
                className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#0B2D5B]"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-2xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold hover:bg-[#F58220] transition-colors cursor-pointer"
              >
                إرسال
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border text-right space-y-2 ${
                    c.isTeacherReply
                      ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200/60 dark:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full overflow-hidden relative border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.userAvatar} alt={c.userName} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
                          <span>{c.userName}</span>
                          {c.isTeacherReply && (
                            <span className="text-[10px] bg-[#F58220] text-white px-2 py-0.5 rounded-full font-bold">
                              المعلم
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{c.timeAgo}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
