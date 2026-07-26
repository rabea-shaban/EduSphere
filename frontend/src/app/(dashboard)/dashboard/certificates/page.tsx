"use client";

import * as React from "react";
import Image from "next/image";
import { GraduationCap, Download, Share2, X } from "lucide-react";
import { mockCertificates, CertificateCard, CertificateItem } from "@/features/dashboard";

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = React.useState<CertificateItem | null>(null);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCertificates.map((cert) => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            onPreview={(c) => setSelectedCert(c)}
          />
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-2xl w-full text-right space-y-4 shadow-2xl relative border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 left-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              معاينة الشهادة: {selectedCert.courseTitle}
            </h3>

            {/* Mock Certificate Visual Frame */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-4 border-[#0B2D5B] bg-slate-900">
              <Image src={selectedCert.thumbnailUrl} alt={selectedCert.courseTitle} fill className="object-cover opacity-95" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                رمز التحقق المعتمد: <strong className="font-mono text-[#F58220]">{selectedCert.certificateCode}</strong>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => alert("جاري تنزيل ملف الشهادة بصيغة PDF عالية الدقة...")}
                  className="flex-1 sm:flex-initial h-11 px-6 rounded-xl bg-[#F58220] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
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
