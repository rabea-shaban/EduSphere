"use client";

import * as React from "react";
import { Users, Search, MessageSquare, BookOpen } from "lucide-react";
import { useAuthContext } from "@/providers/auth-provider";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export default function InstructorStudentsPage() {
  const { user } = useAuthContext();
  const [students, setStudents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const fetchStudents = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/enrollments/teacher-students", {
        params: { teacherId: user?._id || user?.id, limit: 100 },
      });
      setStudents(res.data?.data?.enrollments || res.data?.data || []);
    } catch {
      // Fallback to searching enrollments if dedicated endpoint is unavailable
      try {
        const res = await api.get("/enrollments/my-courses");
        setStudents(res.data?.data?.enrollments || []);
      } catch {
        toast.error("تعذر جلب قائمة الطلاب المشتركين");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  const filtered = students.filter((item) => {
    const name = `${item.studentId?.firstName || ""} ${item.studentId?.lastName || ""}`.trim() || item.studentId?.email || "";
    const courseName = item.courseId?.title || "";
    return name.toLowerCase().includes(search.toLowerCase()) || courseName.toLowerCase().includes(search.toLowerCase());
  });

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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2.5 sm:space-y-3">
          {filtered.map((item) => {
            const studentObj = item.studentId || {};
            const studentName = `${studentObj.firstName || ""} ${studentObj.lastName || ""}`.trim() || studentObj.email || "طالب EduSphere";
            const courseTitle = item.courseId?.title || "كورس تعليمي";
            const avatarInitial = studentName.charAt(0).toUpperCase();

            return (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#0B2D5B] to-[#1E73D8] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {avatarInitial}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">{studentName}</h4>
                    <p className="text-xs text-[#F58220] font-bold">{courseTitle}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-semibold">
                  تاريخ الاشتراك: {new Date(item.createdAt || Date.now()).toLocaleDateString("ar-EG")}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <Users className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لا يوجد طلاب مشتركين بعد</h4>
          <p className="text-xs text-slate-500">عند اشتراك الطلاب في كورساتك ستظهر قائمة أسمائهم وإحصائياتهم هنا</p>
        </div>
      )}
    </div>
  );
}
