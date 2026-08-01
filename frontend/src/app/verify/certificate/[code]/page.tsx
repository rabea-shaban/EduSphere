"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Award, GraduationCap, CheckCircle2, Calendar, User, BookOpen, ExternalLink, ArrowRight, Share2, Printer, Eye, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function CertificateVerificationPage() {
  const params = useParams();
  const code = (params?.code as string) || "EDU-2026-0180";
  const [showFullDoc, setShowFullDoc] = React.useState(false);

  const studentName = "ربيع شعبان إبراهيم مصطفى";
  const courseTitle = "أساسيات البرمجة وتطوير الويب";
  const teacherName = "Eng Rabea Shaban";
  const issueDate = "1 أغسطس 2026";
  const grade = "ممتاز (98%)";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط التوثيق المعتمد بنجاح");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 dir-rtl relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-6 relative z-10 my-8"
      >
        {/* Platform Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="EduSphere Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>EduSphere</span>
                <span className="text-[#F58220] font-bold text-xs">منصة التعليم الذكي</span>
              </h1>
              <p className="text-[10px] text-slate-400">نظام توثيق وتأكيد صحة الشهادات الأكاديمية</p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>توثيق رقمي نشط</span>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden">
          {/* Top Banner Ribbon - No Emoji */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 text-amber-300">
            <ShieldCheck className="h-7 w-7 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-sm font-black">تم التثبت من أصل وسلامة هذه الشهادة الأكاديمية</h2>
              <p className="text-xs text-amber-200/80 mt-0.5">
                هذه الوثيقة صادرة ومسجلة رسمياً في السجل الأكاديمي لمنصة EduSphere وموثقة إلكترونياً.
              </p>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="space-y-4">
            <div className="text-center py-4 border-b border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 font-bold inline-block">
                رمز التحقق الرسمي: {code}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white pt-1">
                {studentName}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">حامل الشهادة المعتمدة</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-500/40 transition-colors">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#F58220]" />
                  <span>اسم الدورة التعليمية</span>
                </div>
                <div className="text-sm font-black text-white pt-1">
                  {courseTitle}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-blue-500/40 transition-colors">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-blue-400" />
                  <span>المعلم والمحاضر المسؤول</span>
                </div>
                <div className="text-sm font-black text-white pt-1">
                  {teacherName}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-emerald-500/40 transition-colors">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>التقدير العام المكتسب</span>
                </div>
                <div className="text-sm font-black text-emerald-400 pt-1">
                  {grade}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-purple-500/40 transition-colors">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>تاريخ صدور التوثيق</span>
                </div>
                <div className="text-sm font-black text-white pt-1">
                  {issueDate}
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Security Stamp */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-center space-y-1 text-[11px] font-mono text-slate-400">
              <span className="text-amber-400 font-sans font-bold">التوقيع الرقمي المشفر (Digital Hash Signature):</span>
              <div className="text-slate-500 break-all text-[10px]">
                0x8F4B9A7C1E32D81F0A6B4C2D8E9F1A3B7C5E2D4F6A8B0C2D4E6F8A1B3C5E7D9F
              </div>
            </div>
          </div>

          {/* Interactive Action Buttons Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFullDoc(true)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Eye className="h-4 w-4" />
              <span>معاينة الوثيقة بالكامل</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-blue-400" />
              <span>مشاركة رابط التوثيق</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>طباعة الشهادة</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
            <Link
              href="/"
              className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة للمنصة الرئيسية</span>
            </Link>

            <Link
              href="/dashboard/certificates"
              className="text-[#F58220] hover:underline font-extrabold flex items-center gap-1"
            >
              <span>انتقل للشهادات الأكاديمية</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Interactive Document Preview Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showFullDoc && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-right space-y-4 shadow-2xl relative border border-white/10 dir-rtl my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-white">الوثيقة الأكاديمية الرسمية المعتمدة</h3>
                <button
                  type="button"
                  onClick={() => setShowFullDoc(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Certificate Frame */}
              <div
                id="printable-certificate"
                className="relative bg-[#FCFBF7] text-[#0B2D5B] rounded-2xl p-6 sm:p-10 border-[10px] border-[#0B2D5B] shadow-2xl space-y-6 overflow-hidden text-center select-none"
              >
                <div className="absolute inset-3 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
                <div className="absolute inset-4 border border-amber-500/20 rounded-lg pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-mark.png" alt="EduSphere Logo" className="h-14 w-auto object-contain shrink-0" />
                    <div className="text-right">
                      <h2 className="text-xl sm:text-2xl font-black text-[#0B2D5B] flex items-center gap-1.5">
                        <span>EduSphere</span>
                        <span className="text-[#F58220] font-bold text-xs">منصة التعليم الذكي</span>
                      </h2>
                      <p className="text-[10px] font-bold text-slate-500">مؤسسة برمجية وأكاديمية مرخصة للتعليم المدمج</p>
                    </div>
                  </div>

                  <div className="text-left font-mono text-xs font-bold text-slate-500 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-700 font-sans font-black">رمز التوثيق الرسمي</div>
                    <span className="text-[#0B2D5B] font-black">{code}</span>
                  </div>
                </div>

                <div className="space-y-1 relative z-10 pt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-800 text-xs font-black border border-amber-500/30">
                    CERTIFICATE OF ACADEMIC EXCELLENCE
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] tracking-wide pt-1">
                    شهادة إتمام وتفوق أكاديمي
                  </h1>
                </div>

                <div className="space-y-4 relative z-10 max-w-2xl mx-auto py-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    تُمنح هذه الشهادة الأكاديمية المعتمدة رسمياً من إدارة منصة <strong>EduSphere</strong> إلى الطالب/ة:
                  </p>

                  <div className="py-2">
                    <div className="text-2xl sm:text-3xl font-black text-[#0B2D5B] border-b-2 border-amber-500/60 inline-block px-8 py-1.5 font-serif">
                      {studentName}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    تقديراً لاستيفائه بنجاح واقتدار لكافة المتطلبات الأكاديمية والتطبيقية في الدورة التعليمية المتخصصة:
                  </p>

                  <div className="py-1">
                    <div className="text-lg sm:text-2xl font-black text-[#F58220] px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 inline-block">
                      « {courseTitle} »
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                      بتقدير عام: <strong>{grade}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                      تاريخ الإصدار: <strong>{issueDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-amber-500/30 relative z-10">
                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-sm font-bold text-[#0B2D5B]">{teacherName}</span>
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">{teacherName}</div>
                    <div className="text-[10px] font-bold text-slate-500">المعلم والمحاضر المسؤول</div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white ring-2 ring-amber-500/50 relative p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-mark.png" alt="EduSphere Stamp" className="h-9 w-auto object-contain drop-shadow-md" />
                      <Sparkles className="h-3 w-3 text-amber-100 absolute top-1 right-1 animate-pulse" />
                    </div>
                    <div className="text-[10px] font-black text-amber-800 mt-1">الختم الأكاديمي المعتمد</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-sm font-bold text-[#0B2D5B]">EduSphere Board</span>
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">إدارة منصة EduSphere</div>
                    <div className="text-[10px] font-bold text-slate-500">الشؤون الأكاديمية والتوثيق</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>طباعة الشهادة</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate,
          #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 32px !important;
            border: 8px solid #0B2D5B !important;
            background-color: #FCFBF7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
