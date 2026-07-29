"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import type { ProfileCompleteness } from "@/features/teacher/types/profile";

interface ProfileCompletionCardProps {
  completeness: ProfileCompleteness;
}

export function ProfileCompletionCard({ completeness }: ProfileCompletionCardProps) {
  const { completionPercentage, completedFields, missingFields, recommendedImprovements } = completeness;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white">
              نسبة مكتملية الملف الشخصي
            </h3>
            <p className="text-xs text-slate-400">إكمال ملفك الشخصي يزيد من فرص اختيار الطلاب لكورساتك</p>
          </div>
        </div>

        <span className="text-lg font-black text-[#F58220]">
          {completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-[#F58220] transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Recommendations */}
      {recommendedImprovements.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
          <p className="font-bold text-slate-700 dark:text-slate-300">نصائح مقترحة لرفع اكتمال الملف:</p>
          {recommendedImprovements.map((tip, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileCompletionCard;
