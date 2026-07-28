"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Calendar, BookMarked, Layers, ShieldCheck } from "lucide-react";
import { AcademicGrade } from "@/services/academic.service";
import { useSubjects } from "@/hooks/useAcademic";

interface GradeDetailsModalProps {
  grade: AcademicGrade | null;
  onClose: () => void;
}

export function GradeDetailsModal({ grade, onClose }: GradeDetailsModalProps) {
  const { data: subjects = [], isLoading } = useSubjects(grade?.educationStage);

  const subjectsList = Array.isArray(subjects) ? subjects : (subjects as any)?.subjects || [];

  if (!grade) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                  {grade.name.ar}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{grade.name.en}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-bold block">المرحلة</span>
              <span className="text-xs font-black text-[#F58220] block">{grade.educationStage}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-bold block">المواد المتاحة</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                {grade.subjectsCount || 0}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-bold block">عدد الكورسات</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block font-mono">
                {grade.coursesCount || 0}
              </span>
            </div>
          </div>

          {/* Description */}
          {grade.description && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs space-y-1">
              <span className="font-bold text-[#0B2D5B] dark:text-white block">الوصف الأكاديمي:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {grade.description}
              </p>
            </div>
          )}

          {/* Associated Subjects List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-[#F58220]" />
              <span>المواد الدراسية المقترنة بالمرحلة:</span>
            </h4>

            {isLoading ? (
              <div className="h-24 w-full bg-slate-100 dark:bg-white/10 rounded-2xl animate-pulse" />
            ) : subjectsList.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-400">
                لا توجد مواد مسجلة حالياً لهذه المرحلة الأكاديمية
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {subjectsList.map((sub: any) => (
                  <div
                    key={sub._id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0B2D5B] dark:text-white">{sub.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({sub.slug})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-bold">
                      مفعلة
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
