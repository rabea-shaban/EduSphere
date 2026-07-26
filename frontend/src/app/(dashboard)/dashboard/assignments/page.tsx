"use client";

import * as React from "react";
import { FileCheck2, UploadCloud, CheckCircle2 } from "lucide-react";
import { mockAssignments, AssignmentCard, AssignmentItem } from "@/features/dashboard";

import { toast } from "react-hot-toast";

export default function AssignmentsPage() {
  const [selectedAssignment, setSelectedAssignment] = React.useState<AssignmentItem | null>(null);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          الواجبات والمشاريع العملية 📋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم برفع الحلول والملفات لمشاريع علوم الحاسب والواجبات المدرسية للحصول على تقييم المعلم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAssignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onSubmitClick={(asg) => setSelectedAssignment(asg)}
          />
        ))}
      </div>

      {/* Upload Dropzone Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-lg w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              تسليم الواجب: {selectedAssignment.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              المادة: {selectedAssignment.subject} | {selectedAssignment.deadline}
            </p>

            {/* Dropzone mockup */}
            <div className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-8 text-center space-y-3 bg-slate-50 dark:bg-white/5">
              <UploadCloud className="h-10 w-10 text-[#F58220] mx-auto" />
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  اسحب ملف الواجب هنا أو اضغط للاختيار
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  الملفات المسموح بها: PDF, ZIP, DOCX (بحد أقصى 25MB)
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("تم تسليم الملف بنجاح وإرساله للمعلم! 🎉");
                  setSelectedAssignment(null);
                }}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md"
              >
                تأكيد التسليم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
