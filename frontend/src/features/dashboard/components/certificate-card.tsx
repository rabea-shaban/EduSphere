"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2, Award, Eye, ExternalLink } from "lucide-react";
import { CertificateItem } from "../types";

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
      {/* Certificate Thumbnail */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <Image
          src={certificate.thumbnailUrl}
          alt={certificate.courseTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5B] via-black/30 to-transparent opacity-80" />

        {/* Code badge */}
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/10">
          {certificate.certificateCode}
        </span>

        {/* Center Preview Button */}
        <button
          type="button"
          onClick={() => onPreview?.(certificate)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm text-white font-bold text-xs gap-2"
        >
          <Eye className="h-5 w-5" />
          <span>معاينة الشهادة</span>
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-extrabold text-[#F58220] bg-[#F58220]/10 px-2.5 py-1 rounded-full border border-[#F58220]/20 inline-block mb-2">
            تقدير: {certificate.grade}
          </span>
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white line-clamp-2 mb-2">
            {certificate.courseTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            المعلم المسؤول: <strong className="text-slate-700 dark:text-slate-200">{certificate.teacherName}</strong>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">تاريخ الإصدار: {certificate.issueDate}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => onPreview?.(certificate)}
            className="h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>تنزيل PDF</span>
          </button>
          <button
            type="button"
            onClick={() => alert(`تم نسخ رابط الشهادة: ${certificate.certificateCode}`)}
            className="h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F58220] transition-colors"
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
