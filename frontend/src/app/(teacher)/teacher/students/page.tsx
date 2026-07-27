"use client";

import * as React from "react";
import { Users, Search, MessageSquare } from "lucide-react";
import { StudentRow } from "@/features/teacher";

const mockStudentList = [
  { id: "s-1", name: "ربيع شعبان", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", courseName: "أساسيات علوم الحاسب والبرمجة", completionPercentage: 78, enrolledDate: "12 مايو 2026" },
  { id: "s-2", name: "سارة محمود", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", courseName: "الذكاء الاصطناعي وتعلم الآلة", completionPercentage: 45, enrolledDate: "15 يونيو 2026" },
  { id: "s-3", name: "أحمد علي", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", courseName: "مهارات البحث والتعليم - البكالوريا", completionPercentage: 92, enrolledDate: "01 يوليو 2026" },
];

export default function InstructorStudentsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = mockStudentList.filter((s) => s.name.includes(search) || s.courseName.includes(search));

  return (
    <div className="space-y-5 sm:space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B2D5B] dark:text-white">
            قائمة الطلاب المشتركين 👥
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            متابعة نسبة إكمال الطلاب للكورسات والمحتوى وتوفير المراسلة المباشرة
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم الطالب..."
            className="w-full h-10 sm:h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] transition-colors"
          />
          <Search className="absolute right-3 top-3 sm:top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {filtered.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
