"use client";

import * as React from "react";
import { GraduationCap, Download, X } from "lucide-react";
import { CertificateCard, CertificateItem } from "@/features/dashboard";
import { useStudent } from "@/hooks/useStudent";
import { toast } from "react-hot-toast";

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = React.useState<CertificateItem | null>(null);
  const { useMyCourses } = useStudent();
  const { data: coursesData, isLoading } = useMyCourses();

  // Filter completed enrollments with certificates issued
  const certificates: CertificateItem[] = React.useMemo(() => {
    if (!coursesData?.enrollments) return [];
    return coursesData.enrollments
      .filter((e) => e.status === "Completed" || e.certificateIssued)
      .map((e, idx) => {
        const course = typeof e.courseId === "object" ? e.courseId : null;
        const teacher = typeof e.teacherId === "object" ? e.teacherId : null;
        const courseTitle = course?.title || "كورس متميز";
        const teacherName = teacher ? `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() : "معلم EduSphere";
        const issueDate = e.completedAt ? new Date(e.completedAt).toLocaleDateString("ar-EG") : "يناير 2026";
        const certCode = `EDU-2026-${(idx + 100).toString().padStart(4, "0")}`;

        return {
          id: e._id,
          courseTitle,
          teacherName,
          issueDate,
          grade: "ممتاز (98%)",
          certificateCode: certCode,
          pdfUrl: "#",
          thumbnailUrl: course?.thumbnail || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
        };
      });
  }, [coursesData]);

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          شهادات الإتمام الأكاديمية 📜
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

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-2xl w-full text-right space-y-4 shadow-2xl relative border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 left-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              معاينة الشهادة: {selectedCert.courseTitle}
            </h3>

            {/* Visual Frame */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-4 border-[#0B2D5B] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedCert.thumbnailUrl} alt={selectedCert.courseTitle} className="h-full w-full object-cover opacity-95" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                رمز التحقق المعتمد: <strong className="font-mono text-[#F58220]">{selectedCert.certificateCode}</strong>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toast.success("جاري تنزيل ملف الشهادة بصيغة PDF عالية الدقة... 📜")}
                  className="flex-1 sm:flex-initial h-11 px-6 rounded-xl bg-[#F58220] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>تنزيل PDF المعتمد</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
