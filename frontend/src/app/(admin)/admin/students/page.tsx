"use client";

import * as React from "react";
import { Users, Search } from "lucide-react";
import { mockUsersList, UserTable } from "@/features/admin";

export default function AdminStudentsPage() {
  const studentsOnly = mockUsersList.filter((u) => u.role === "student");

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إدارة طلاب المنصة 🎓
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة سجلات الطلاب، المراحل الدراسية، والاشتراكات الفعالة
        </p>
      </div>

      <UserTable users={studentsOnly} />
    </div>
  );
}
