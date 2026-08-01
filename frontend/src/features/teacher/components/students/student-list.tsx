"use client";

import * as React from "react";
import { Search, RefreshCw, Users } from "lucide-react";
import { useTeacherStudents } from "@/hooks/useTeacherStudents";
import type { TeacherStudent, TeacherStudentFilters } from "@/features/teacher/types/student";
import { StudentSkeleton } from "./student-skeleton";
import { StudentEmptyState } from "./student-empty-state";
import { StudentCard } from "./student-card";
import { StudentProfileDialog } from "./student-profile-dialog";
import { SendStudentNotificationDialog } from "./send-student-notification-dialog";
import { IssueCertificateDialog } from "./issue-certificate-dialog";
import { AwardBadgeDialog } from "./award-badge-dialog";

interface StudentListProps {
  courseId?: string;
}

export function StudentList({ courseId }: StudentListProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [progressFilter, setProgressFilter] = React.useState<"ALL" | "Completed" | "InProgress">("ALL");
  const [sortOption, setSortOption] = React.useState<"newest" | "highest_progress" | "lowest_progress" | "highest_quiz">("newest");

  // Action Dialog targets
  const [profileTarget, setProfileTarget] = React.useState<TeacherStudent | null>(null);
  const [notificationTarget, setNotificationTarget] = React.useState<TeacherStudent | null>(null);
  const [certificateTarget, setCertificateTarget] = React.useState<TeacherStudent | null>(null);
  const [badgeTarget, setBadgeTarget] = React.useState<TeacherStudent | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: TeacherStudentFilters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(progressFilter !== "ALL" ? { progress: progressFilter } : {}),
    ...(courseId ? { courseId } : {}),
    sort: sortOption,
    limit: 100,
  };

  const { data, isLoading, isError, refetch } = useTeacherStudents(filters);

  const students = data?.students || [];
  const total = data?.pagination?.total || 0;
  const isFiltered = !!debouncedSearch || progressFilter !== "ALL";

  return (
    <div className="space-y-4 text-right dir-rtl">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#0B2D5B]/30 p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
            <Users className="h-4 w-4 text-indigo-500" />
            إجمالي الطلاب المشتركين
          </span>
          {!isLoading && (
            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-[11px] font-bold">
              {total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم الطالب أو الإيميل..."
              className="w-full h-8 pr-8 pl-3 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
            />
            <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Progress Filter */}
          <select
            value={progressFilter}
            onChange={(e) => setProgressFilter(e.target.value as any)}
            className="h-8 px-2 rounded-lg bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-[11px] font-bold outline-none cursor-pointer"
          >
            <option value="ALL">جميع نسب الإكمال</option>
            <option value="Completed">مكتمل (100%)</option>
            <option value="InProgress">قيد التعلم (أقل من 100%)</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="h-8 px-2 rounded-lg bg-white dark:bg-[#0B2D5B] border border-slate-200 dark:border-white/10 text-[11px] font-bold outline-none cursor-pointer"
          >
            <option value="newest">الأحدث اشتراكاً</option>
            <option value="highest_progress">الأعلى إكمالاً</option>
            <option value="lowest_progress">الأقل إكمالاً</option>
            <option value="highest_quiz">الأعلى في درجات الاختبارات</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            title="تحديث القائمة"
            aria-label="تحديث"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <StudentSkeleton />
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50 text-center text-xs font-bold text-rose-600">
          تعذر جلب قائمة الطلاب المشتركين
        </div>
      ) : students.length === 0 ? (
        <StudentEmptyState filtered={isFiltered} />
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onViewProfile={setProfileTarget}
              onSendNotification={setNotificationTarget}
              onIssueCertificate={setCertificateTarget}
              onManageBadge={setBadgeTarget}
            />
          ))}
        </div>
      )}

      {/* Action Dialogs */}
      <StudentProfileDialog
        student={profileTarget}
        isOpen={!!profileTarget}
        onClose={() => setProfileTarget(null)}
      />

      <SendStudentNotificationDialog
        student={notificationTarget}
        isOpen={!!notificationTarget}
        onClose={() => setNotificationTarget(null)}
      />

      <IssueCertificateDialog
        student={certificateTarget}
        isOpen={!!certificateTarget}
        onClose={() => setCertificateTarget(null)}
      />

      <AwardBadgeDialog
        student={badgeTarget}
        isOpen={!!badgeTarget}
        onClose={() => setBadgeTarget(null)}
      />
    </div>
  );
}

export default StudentList;
