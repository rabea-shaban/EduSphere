"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, Share2, Award, Eye, GraduationCap, CheckCircle2 } from "lucide-react";
import { CertificateItem } from "../types";
import { toast } from "react-hot-toast";

interface CertificateCardProps {
  certificate: CertificateItem;
  onPreview?: (certificate: CertificateItem) => void;
}

export function CertificateCard({ certificate, onPreview }: CertificateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between text-right"
    >
      {/* ── Mini Official Academic Certificate Document Render ─────────────── */}
      <div className="relative h-56 w-full bg-[#FCFBF7] text-[#0B2D5B] border-b-4 border-[#0B2D5B] p-4 flex flex-col justify-between overflow-hidden select-none">
        {/* Inner Gold Border Ornament */}
        <div className="absolute inset-2 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 border border-amber-500/20 rounded-lg pointer-events-none" />

        {/* Background Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="Watermark" className="h-36 w-auto object-contain" />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="EduSphere Logo" className="h-6 w-auto object-contain shrink-0" />
            <span className="text-xs font-black tracking-tight text-[#0B2D5B]">EduSphere</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <Award className="h-3 w-3 text-amber-600" />
            <span>{certificate.certificateCode}</span>
          </div>
        </div>

        {/* Certificate Title & Recipient Mini Banner */}
        <div className="text-center space-y-1 relative z-10 py-1">
          <div className="text-[9px] font-black text-amber-800 tracking-wider">
            CERTIFICATE OF ACADEMIC EXCELLENCE
          </div>
          <h4 className="text-sm font-black text-[#0B2D5B]">
            شهادة إتمام وتفوق أكاديمي
          </h4>
          <div className="text-xs font-black text-[#0B2D5B] border-b-2 border-amber-500/50 inline-block px-3 py-0.5 font-serif">
            {certificate.studentName || "ربيع شعبان إبراهيم مصطفى"}
          </div>
          <p className="text-[11px] font-black text-[#F58220] line-clamp-1 pt-0.5">
            « {certificate.courseTitle} »
          </p>
        </div>

        {/* Mini Signatures & Gold Stamp Footer */}
        <div className="flex items-center justify-between relative z-10 pt-1 border-t border-amber-500/30 text-[9px] font-bold text-slate-600">
          <div className="text-right">
            <div className="text-[#0B2D5B] font-black">{certificate.teacherName}</div>
            <div className="text-[8px] text-slate-400">المعلم المسؤول</div>
          </div>

          {/* Mini Gold Stamp */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex items-center justify-center shadow-md border-2 border-white p-1 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="EduSphere Stamp" className="h-5 w-auto object-contain drop-shadow-sm" />
          </div>

          <div className="text-left">
            <div className="text-[#0B2D5B] font-black">EduSphere Board</div>
            <div className="text-[8px] text-slate-400">اعتماد الأكاديمية</div>
          </div>
        </div>

        {/* Hover Overlay Button */}
        <button
          type="button"
          onClick={() => onPreview?.(certificate)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B2D5B]/80 backdrop-blur-xs text-white font-black text-xs gap-2 cursor-pointer z-20"
        >
          <Eye className="h-5 w-5 text-amber-400" />
          <span>تكبير ومعاينة الشهادة الكاملة</span>
        </button>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#F58220] bg-[#F58220]/10 px-3 py-1 rounded-full border border-[#F58220]/20 inline-block">
              تقدير: {certificate.grade}
            </span>

            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>موثقة إلكترونياً</span>
            </span>
          </div>

          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white line-clamp-2 leading-snug">
            {certificate.courseTitle}
          </h3>

          <div className="pt-1 space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <p className="flex items-center gap-1">
              <span>المعلم المسؤول:</span>
              <strong className="text-[#0B2D5B] dark:text-amber-400 font-bold">{certificate.teacherName}</strong>
            </p>
            <p className="text-[11px] text-slate-400">تاريخ الإصدار: {certificate.issueDate}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => onPreview?.(certificate)}
            className="h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#F58220]" />
            <span>تنزيل PDF</span>
          </button>
          <button
            type="button"
            onClick={() => toast.success(`تم نسخ رابط التحقق من الشهادة: ${certificate.certificateCode}`)}
            className="h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F58220] transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="h-4 w-4" />
            <span>مشاركة</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CertificateCard;
