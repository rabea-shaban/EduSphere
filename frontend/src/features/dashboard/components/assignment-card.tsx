"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";
import { AssignmentItem } from "../types";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  assignment: AssignmentItem;
  onSubmitClick?: (assignment: AssignmentItem) => void;
}

export function AssignmentCard({ assignment, onSubmitClick }: AssignmentCardProps) {
  const isGraded = assignment.status === "graded";
  const isSubmitted = assignment.status === "submitted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
            {assignment.subject}
          </span>
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full border",
              isGraded
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : isSubmitted
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            )}
          >
            {isGraded ? `الدرجة: ${assignment.grade}` : isSubmitted ? "قيد التقييم" : assignment.deadline}
          </span>
        </div>

        <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white line-clamp-2 mb-1">
          {assignment.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{assignment.courseName}</p>

        {assignment.feedback && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-3">
            <strong className="block font-bold mb-1">ملاحظة المعلم:</strong>
            {assignment.feedback}
          </div>
        )}
      </div>

      <div>
        {isGraded || isSubmitted ? (
          <div className="w-full h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>تم تسليم الملف بنجاح ({assignment.submissionDate})</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSubmitClick?.(assignment)}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#F58220]/20 hover:shadow-lg transition-all"
          >
            <UploadCloud className="h-4.5 w-4.5" />
            <span>رفع وتسليم الواجب</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default AssignmentCard;
