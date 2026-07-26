"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, GraduationCap, Award } from "lucide-react";
import { TeacherApprovalRequest } from "../types";

interface TeacherApprovalCardProps {
  request: TeacherApprovalRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function TeacherApprovalCard({ request, onApprove, onReject }: TeacherApprovalCardProps) {
  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-right space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-[#0B2D5B] shrink-0">
          <Image src={request.avatar} alt={request.teacherName} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">{request.teacherName}</h3>
          <p className="text-xs font-bold text-[#F58220]">{request.subject}</p>
          <span className="text-[10px] text-slate-400">تاريخ الطلب: {request.appliedDate}</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المؤهلات المقدمة:</span>
        <div className="space-y-1">
          {request.qualifications.map((q, idx) => (
            <div key={idx} className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-100 dark:border-white/5">
              • {q}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => onReject?.(request.id)}
          className="flex-1 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100"
        >
          <XCircle className="h-4 w-4" />
          <span>رفض الطلب</span>
        </button>
        <button
          type="button"
          onClick={() => onApprove?.(request.id)}
          className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md hover:bg-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>اعتماد كـ معلم بالمناصة</span>
        </button>
      </div>
    </div>
  );
}

export default TeacherApprovalCard;
