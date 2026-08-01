"use client";

import * as React from "react";
import { GraduationCap, Download, X, Award, Printer, Share2, Sparkles, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { CertificateCard, CertificateItem } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = React.useState<CertificateItem | null>(null);
  const { profile, useMyCourses } = useStudent();
  const { data: coursesData, isLoading } = useMyCourses();

  // Get student's full name
  const studentName = React.useMemo(() => {
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    }
    return "Rabea Shaban ibrahim Mustafa";
  }, [profile]);

  // Filter completed enrollments with certificates issued
  const certificates: CertificateItem[] = React.useMemo(() => {
    if (!coursesData?.enrollments) return [];
    return coursesData.enrollments
      .filter((e) => e.status === "Completed" || e.certificateIssued)
      .map((e, idx) => {
        const course = typeof e.courseId === "object" ? e.courseId : null;
        const teacher = typeof e.teacherId === "object" ? e.teacherId : null;
        const courseTitle = course?.title || "أساسيات البرمجة وتطوير الويب";
        const teacherName = teacher
          ? `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim()
          : "Eng Rabea Shaban";
        const issueDate = e.completedAt
          ? new Date(e.completedAt).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "1 أغسطس 2026";
        const certCode = `EDU-2026-${(idx + 180).toString().padStart(4, "0")}`;

        return {
          id: e._id,
          courseTitle,
          teacherName,
          studentName,
          issueDate,
          grade: "ممتاز (100%)",
          certificateCode: certCode,
          pdfUrl: "#",
          thumbnailUrl: course?.thumbnail || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
        };
      });
  }, [coursesData]);

  const handlePrint = () => {
    if (!selectedCert) return;

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0px";
    printFrame.style.height = "0px";
    printFrame.style.border = "none";
    printFrame.style.zIndex = "-9999";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      typeof window !== "undefined"
        ? `${window.location.origin}/verify/certificate/${selectedCert.certificateCode}`
        : `http://localhost:3000/verify/certificate/${selectedCert.certificateCode}`
    )}`;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <title>EduSphere Certificate - ${selectedCert.certificateCode}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:wght@700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            html, body {
              width: 297mm;
              height: 210mm;
              margin: 0;
              padding: 0;
              background-color: #FCFBF7;
              font-family: 'Cairo', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: hidden;
            }
            .cert-body {
              width: 297mm;
              height: 210mm;
              padding: 10mm 14mm;
              background-color: #FCFBF7;
              border: 9mm solid #0B2D5B;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              color: #0B2D5B;
            }
            .inner-border-1 {
              position: absolute;
              inset: 2.5mm;
              border: 2px solid rgba(245, 158, 11, 0.5);
              border-radius: 8px;
              pointer-events: none;
            }
            .inner-border-2 {
              position: absolute;
              inset: 4mm;
              border: 1px solid rgba(245, 158, 11, 0.25);
              border-radius: 6px;
              pointer-events: none;
            }
            .flourish-tr { position: absolute; top: 5mm; right: 5mm; width: 8mm; height: 8mm; border-top: 3px solid #d97706; border-right: 3px solid #d97706; }
            .flourish-tl { position: absolute; top: 5mm; left: 5mm; width: 8mm; height: 8mm; border-top: 3px solid #d97706; border-left: 3px solid #d97706; }
            .flourish-br { position: absolute; bottom: 5mm; right: 5mm; width: 8mm; height: 8mm; border-bottom: 3px solid #d97706; border-right: 3px solid #d97706; }
            .flourish-bl { position: absolute; bottom: 5mm; left: 5mm; width: 8mm; height: 8mm; border-bottom: 3px solid #d97706; border-left: 3px solid #d97706; }
            
            .watermark {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.04;
              pointer-events: none;
            }
            .watermark img {
              height: 110mm;
              width: auto;
            }

            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid rgba(245, 158, 11, 0.35);
              padding-bottom: 2.5mm;
              position: relative;
              z-index: 10;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 3mm;
            }
            .brand img {
              height: 11mm;
              width: auto;
            }
            .brand-text {
              text-align: right;
            }
            .brand-title {
              font-size: 15pt;
              font-weight: 900;
              color: #0B2D5B;
            }
            .brand-sub {
              font-size: 7.5pt;
              font-weight: 700;
              color: #64748b;
            }
            .cert-code-box {
              background: rgba(245, 158, 11, 0.1);
              border: 1px solid rgba(245, 158, 11, 0.3);
              padding: 1.5mm 3.5mm;
              border-radius: 6px;
              font-family: monospace;
              font-size: 8.5pt;
              font-weight: bold;
              text-align: left;
            }

            .main-title {
              margin-top: 1mm;
              position: relative;
              z-index: 10;
            }
            .title-badge {
              display: inline-block;
              padding: 1mm 4mm;
              background: rgba(245, 158, 11, 0.15);
              border: 1px solid rgba(245, 158, 11, 0.3);
              border-radius: 20px;
              font-size: 7.5pt;
              font-weight: 900;
              color: #92400e;
            }
            .h1-title {
              font-size: 22pt;
              font-weight: 900;
              color: #0B2D5B;
              margin-top: 1mm;
            }

            .body-content {
              margin: 1.5mm 0;
              position: relative;
              z-index: 10;
            }
            .award-text {
              font-size: 10.5pt;
              font-weight: 600;
              color: #475569;
            }
            .student-name-container {
              margin: 1.5mm 0;
            }
            .student-name {
              font-size: 20pt;
              font-weight: bold;
              color: #0B2D5B;
              border-bottom: 2px solid rgba(245, 158, 11, 0.6);
              display: inline-block;
              padding: 0.5mm 6mm;
              font-family: 'Amiri', serif;
              white-space: nowrap;
            }
            .course-title {
              font-size: 14pt;
              font-weight: 900;
              color: #F58220;
              background: rgba(245, 158, 11, 0.1);
              border: 1px solid rgba(245, 158, 11, 0.3);
              padding: 1.5mm 5mm;
              border-radius: 8px;
              display: inline-block;
              margin: 1.5mm 0;
            }
            .meta-tags {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 3mm;
              margin-top: 1.5mm;
              font-size: 8.5pt;
              font-weight: bold;
            }
            .tag-green {
              background: rgba(16, 185, 129, 0.1);
              color: #047857;
              border: 1px solid rgba(16, 185, 129, 0.3);
              padding: 1mm 3mm;
              border-radius: 6px;
            }
            .tag-slate {
              background: #f1f5f9;
              color: #334155;
              border: 1px solid #e2e8f0;
              padding: 1mm 3mm;
              border-radius: 6px;
            }

            .signatures-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              align-items: flex-end;
              border-top: 1px solid rgba(245, 158, 11, 0.35);
              padding-top: 2.5mm;
              position: relative;
              z-index: 10;
            }
            .sig-box {
              text-align: center;
            }
            .sig-line {
              height: 5mm;
              border-bottom: 1px dashed #94a3b8;
              font-family: 'Amiri', serif;
              font-size: 9.5pt;
              font-weight: bold;
              margin-bottom: 1mm;
              display: flex;
              align-items: flex-end;
              justify-content: center;
            }
            .sig-name {
              font-size: 8.5pt;
              font-weight: 900;
              color: #0B2D5B;
            }
            .sig-role {
              font-size: 7pt;
              font-weight: bold;
              color: #64748b;
            }
            .seal-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .seal-circle {
              width: 13mm;
              height: 13mm;
              border-radius: 50%;
              background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .seal-circle img {
              height: 7.5mm;
              width: auto;
            }
            .seal-label {
              font-size: 7pt;
              font-weight: 900;
              color: #92400e;
              margin-top: 0.5mm;
            }

            .footer-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-top: 1px solid rgba(226, 232, 240, 0.8);
              padding-top: 1.5mm;
              font-size: 7.5pt;
              color: #94a3b8;
              position: relative;
              z-index: 10;
            }
            .qr-code {
              width: 13mm;
              height: 13mm;
              border: 1px solid #0B2D5B;
              background: #ffffff;
              padding: 0.5mm;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="cert-body">
            <div class="inner-border-1"></div>
            <div class="inner-border-2"></div>
            <div class="flourish-tr"></div>
            <div class="flourish-tl"></div>
            <div class="flourish-br"></div>
            <div class="flourish-bl"></div>

            <div class="watermark">
              <img src="/logo-mark.png" alt="EduSphere Watermark" />
            </div>

            <div class="header">
              <div class="brand">
                <img src="/logo-mark.png" alt="EduSphere Logo" />
                <div class="brand-text">
                  <div class="brand-title">EduSphere <span style="color: #F58220; font-size: 8.5pt;">منصة التعليم الذكي</span></div>
                  <div class="brand-sub">مؤسسة برمجية وأكاديمية مرخصة للتعليم الرقمي والمدمج</div>
                </div>
              </div>
              <div class="cert-code-box">
                <div style="font-size: 6.5pt; color: #92400e; font-family: sans-serif;">رمز التوثيق الرسمي</div>
                <div>${selectedCert.certificateCode}</div>
              </div>
            </div>

            <div class="main-title">
              <div class="title-badge">CERTIFICATE OF ACADEMIC EXCELLENCE</div>
              <div class="h1-title">شهادة إتمام وتفوق أكاديمي</div>
            </div>

            <div class="body-content">
              <p class="award-text">تُمنح هذه الشهادة الأكاديمية المعتمدة رسمياً من إدارة منصة <strong>EduSphere</strong> إلى الطالب/ة:</p>
              <div class="student-name-container">
                <div class="student-name">${studentName}</div>
              </div>
              <p class="award-text" style="font-size: 9pt; margin-top: 1mm;">تقديراً لاستيفائه بنجاح واقتدار لكافة المتطلبات والأجزاء التطبيقية والاختبارات المعتمدة في الدورة التعليمية المتخصصة:</p>
              <div>
                <div class="course-title">« ${selectedCert.courseTitle} »</div>
              </div>
              <div class="meta-tags">
                <span class="tag-green">بتقدير عام: <strong>${selectedCert.grade}</strong></span>
                <span class="tag-slate">تاريخ الإصدار: <strong>${selectedCert.issueDate}</strong></span>
              </div>
            </div>

            <div class="signatures-grid">
              <div class="sig-box">
                <div class="sig-line">${selectedCert.teacherName}</div>
                <div class="sig-name">${selectedCert.teacherName}</div>
                <div class="sig-role">المعلم والمحاضر المسؤول</div>
              </div>
              <div class="seal-wrapper">
                <div class="seal-circle">
                  <img src="/logo-mark.png" alt="EduSphere Stamp" />
                </div>
                <div class="seal-label">الختم الأكاديمي المعتمد</div>
              </div>
              <div class="sig-box">
                <div class="sig-line">EduSphere Board</div>
                <div class="sig-name">إدارة منصة EduSphere</div>
                <div class="sig-role">الشؤون الأكاديمية والتوثيق</div>
              </div>
            </div>

            <div class="footer-bar">
              <div style="display: flex; align-items: center; gap: 2mm;">
                <img
                  src="${qrUrl}"
                  alt="QR Verification"
                  class="qr-code"
                />
              </div>
              <div style="text-align: left; font-weight: bold;">
                <div style="color: #0B2D5B; font-size: 7.5pt;">EduSphere Official Verification</div>
                <div style="font-size: 6.5pt; color: #94a3b8;">جميع الحقوق محفوظة للمنصة التعليمية © 2026</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1500);
    }, 400);
  };

  return (
    <div className="space-y-6 text-right dir-rtl">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          شهادات الإتمام الأكاديمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          عرض الشهادات الموثقة الصادرة باسمك عقب إتمام المسارات والكورسات التعليمية
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onPreview={(c) => setSelectedCert(c)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 p-8 space-y-3">
          <GraduationCap className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">لا توجد شهادات صادرة بعد</h3>
          <p className="text-xs text-slate-500">أكمل دراسة الكورسات واجتز كافة الدروس للحصول على شهادات الإتمام المعتمدة</p>
        </div>
      )}

      {/* ── Ultra-Professional Certificate Modal Preview ──────────────────── */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl p-4 sm:p-6 max-w-4xl w-full text-right space-y-4 shadow-2xl relative border border-white/10 dir-rtl my-8"
            >
              {/* Close & Action Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">
                    معاينة الشهادة الأكاديمية المعتمدة
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Official Printable Certificate Document Frame ───────────── */}
              <div
                id="printable-certificate"
                className="relative bg-[#FCFBF7] text-[#0B2D5B] rounded-2xl p-6 sm:p-10 border-[10px] border-[#0B2D5B] shadow-2xl space-y-6 overflow-hidden text-center select-none"
              >
                {/* Gold Inner Border Ornament */}
                <div className="absolute inset-3 border-2 border-amber-500/40 rounded-xl pointer-events-none" />
                <div className="absolute inset-4 border border-amber-500/20 rounded-lg pointer-events-none" />

                {/* Corner Flourish Accents */}
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-amber-500/80" />
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-amber-500/80" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-amber-500/80" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-amber-500/80" />

                {/* Background Watermark Seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.png" alt="EduSphere Watermark" className="h-80 w-auto object-contain" />
                </div>

                {/* Certificate Brand Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-mark.png"
                      alt="EduSphere Logo"
                      className="h-14 w-auto object-contain drop-shadow-md shrink-0"
                    />
                    <div className="text-right">
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B2D5B] flex items-center gap-1.5">
                        <span>EduSphere</span>
                        <span className="text-[#F58220] font-bold text-xs">منصة التعليم الذكي</span>
                      </h2>
                      <p className="text-[10px] font-bold text-slate-500">
                        مؤسسة برمجية وأكاديمية مرخصة للتعليم الرقمي والمدمج
                      </p>
                    </div>
                  </div>

                  <div className="text-left font-mono text-xs font-bold text-slate-500 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-700 font-sans font-black">رمز التوثيق الرسمي</div>
                    <span className="text-[#0B2D5B] font-black">{selectedCert.certificateCode}</span>
                  </div>
                </div>

                {/* Main Title Banner */}
                <div className="space-y-1 relative z-10 pt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 text-amber-800 text-xs font-black border border-amber-500/30">
                    CERTIFICATE OF ACADEMIC EXCELLENCE
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#0B2D5B] tracking-wide pt-1">
                    شهادة إتمام وتفوق أكاديمي
                  </h1>
                </div>

                {/* Awarding Statement */}
                <div className="space-y-4 relative z-10 max-w-2xl mx-auto py-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    تُمنح هذه الشهادة الأكاديمية المعتمدة رسمياً من إدارة منصة <strong>EduSphere</strong> إلى الطالب/ة:
                  </p>

                  <div className="py-2">
                    <div className="student-name text-xl sm:text-3xl font-black text-[#0B2D5B] border-b-2 border-amber-500/60 inline-block px-8 py-1.5 font-serif tracking-wide whitespace-nowrap max-w-full">
                      {studentName}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    تقديراً لاستيفائه بنجاح واقتدار لكافة المتطلبات والأجزاء التطبيقية والاختبارات المعتمدة في الدورة التعليمية المتخصصة:
                  </p>

                  <div className="py-1">
                    <div className="text-lg sm:text-2xl font-black text-[#F58220] px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 inline-block">
                      « {selectedCert.courseTitle} »
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                      بتقدير عام: <strong>{selectedCert.grade}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                      تاريخ الإصدار: <strong>{selectedCert.issueDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Signatures & Official Verified Seal Grid */}
                <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-amber-500/30 relative z-10">
                  {/* Teacher Signature (Right) */}
                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-sm font-bold text-[#0B2D5B]">
                        {selectedCert.teacherName}
                      </span>
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">{selectedCert.teacherName}</div>
                    <div className="text-[10px] font-bold text-slate-500">المعلم والمحاضر المسؤول</div>
                  </div>

                  {/* Gold Verified Seal (Center) */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white ring-2 ring-amber-500/50 relative p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-mark.png" alt="EduSphere Stamp" className="h-9 w-auto object-contain drop-shadow-md" />
                      <Sparkles className="h-3 w-3 text-amber-100 absolute top-1 right-1 animate-pulse" />
                    </div>
                    <div className="text-[10px] font-black text-amber-800 mt-1">الختم الأكاديمي المعتمد</div>
                  </div>

                  {/* Executive Signature (Left) */}
                  <div className="text-center space-y-1">
                    <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-sm font-bold text-[#0B2D5B]">
                        EduSphere Board
                      </span>
                    </div>
                    <div className="text-xs font-black text-[#0B2D5B]">إدارة منصة EduSphere</div>
                    <div className="text-[10px] font-bold text-slate-500">الشؤون الأكاديمية والتوثيق</div>
                  </div>
                </div>

                {/* Footer QR Verification Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-200/60 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? `${window.location.origin}/verify/certificate/${selectedCert.certificateCode}`
                          : `http://localhost:3000/verify/certificate/${selectedCert.certificateCode}`
                      )}`}
                      alt="Certificate QR Code Verification"
                      className="cert-qr-code h-14 w-14 rounded-xl border-2 border-[#0B2D5B] bg-white p-1 shadow-sm shrink-0"
                    />
                  </div>

                  <div className="text-left space-y-0.5 font-bold">
                    <div className="text-[#0B2D5B]">EduSphere Official Verification</div>
                    <div className="text-[9px] text-slate-400">جميع الحقوق محفوظة للمنصة التعليمية © 2026</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 font-semibold">
                  رمز التحقق المعتمد: <strong className="font-mono text-amber-400">{selectedCert.certificateCode}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 sm:flex-initial h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>طباعة / تنزيل PDF المعتمد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success(`تم نسخ رابط الشهادة الموثقة: ${selectedCert.certificateCode}`)}
                    className="h-11 px-4 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ── Print Stylesheet for Clean Certificate Printing Only (Strict Single Page Landscape) ── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape !important;
            margin: 0 !important;
          }
          html, body {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #FCFBF7 !important;
            color: #0B2D5B !important;
          }
          /* Hide all page content except the printable target */
          body > * {
            display: none !important;
          }
          body > main,
          body > div,
          #__next {
            display: block !important;
          }
          header, nav, footer, aside, button, iframe, video, .fixed.inset-0 {
            display: none !important;
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
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 14px 24px !important;
            box-shadow: none !important;
            border: 8px solid #0B2D5B !important;
            background-color: #FCFBF7 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-before: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            z-index: 99999999 !important;
          }
          #printable-certificate h1 {
            font-size: 24px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }
          #printable-certificate h2 {
            font-size: 18px !important;
            margin: 0 !important;
          }
          #printable-certificate p,
          #printable-certificate span,
          #printable-certificate div {
            font-size: 11px !important;
          }
          #printable-certificate .cert-qr-code {
            width: 54px !important;
            height: 54px !important;
            min-width: 54px !important;
            min-height: 54px !important;
            border-width: 2px !important;
            padding: 2px !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
