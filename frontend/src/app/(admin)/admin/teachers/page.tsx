"use client";

import * as React from "react";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { mockPendingTeachers, TeacherApprovalCard, TeacherApprovalRequest } from "@/features/admin";

import { toast } from "react-hot-toast";

export default function AdminTeachersPage() {
  const [requests, setRequests] = React.useState<TeacherApprovalRequest[]>(mockPendingTeachers);

  const handleApprove = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    toast.success("تم اعتماد المعلم بنجاح وتفعيل حسابه على منصة EduSphere! 🎉");
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    toast.error("تم رفض طلب الانضمام وتنبيه صاحب الطلب.");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          مركز اعتماد المعلمين والمحاضرين 👨‍🏫
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          مراجعة ملفات السيرة الذاتية، الخبرات الأكاديمية، واعتماد انضمام المحاضرين للمنصة
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <TeacherApprovalCard key={req.id} request={req} onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-center space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لا توجد طلبات معلقة حالياً</h3>
          <p className="text-xs text-slate-500">تم مراجعة واعتماد جميع طلبات الانضمام بنجاح 🎉</p>
        </div>
      )}
    </div>
  );
}
