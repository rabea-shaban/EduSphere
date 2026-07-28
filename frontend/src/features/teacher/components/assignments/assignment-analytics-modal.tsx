"use client";

import * as React from "react";
import {
  X,
  BarChart3,
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useAssignmentAnalytics } from "@/hooks/useAssignments";
import type { ApiAssignment } from "@/features/teacher/types/assignment";

interface AssignmentAnalyticsModalProps {
  assignment: ApiAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentAnalyticsModal({ assignment, isOpen, onClose }: AssignmentAnalyticsModalProps) {
  const assignmentId = assignment?._id || "";
  const { data: analytics, isLoading } = useAssignmentAnalytics(assignmentId);

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] text-right dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تحليلات وإحصائيات الواجب التطبيقي
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {assignment.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500">جاري تجميع التحليلات والإحصائيات...</p>
            </div>
          ) : !analytics ? (
            <p className="text-xs text-rose-500 text-center py-6">تعذر تحميل بيانات الإحصائيات.</p>
          ) : (
            <>
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <Users className="h-3.5 w-3.5" />
                    عدد التسليمات
                  </span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {analytics.submissionsCount}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Award className="h-3.5 w-3.5" />
                    متوسط الدرجات
                  </span>
                  <p className="text-xl font-black text-[#0B2D5B] dark:text-white mt-1">
                    {analytics.averageGrade} / {analytics.totalMarks}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    نسبة النجاح
                  </span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {analytics.passRate}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <XCircle className="h-3.5 w-3.5" />
                    التسليمات المتأخرة
                  </span>
                  <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                    {analytics.lateCount} ({analytics.lateSubmissionRate}%)
                  </p>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">أعلى درجة مسجلة:</span>
                  <span className="font-black text-[#0B2D5B] dark:text-white">
                    {analytics.highestGrade} / {analytics.totalMarks}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">أدنى درجة مسجلة:</span>
                  <span className="font-black text-[#0B2D5B] dark:text-white">
                    {analytics.lowestGrade} / {analytics.totalMarks}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">درجة النجاح الدنيا المطلوبة:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {analytics.passingMarks} درجة
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignmentAnalyticsModal;
