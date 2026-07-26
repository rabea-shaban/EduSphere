"use client";

import * as React from "react";
import Image from "next/image";
import { UserRecord } from "../types";
import { ShieldCheck, UserX, UserCheck, MoreVertical, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: UserRecord[];
  onToggleStatus?: (userId: string) => void;
}

export function UserTable({ users, onToggleStatus }: UserTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0F274D] shadow-sm text-right">
      <table className="w-full text-xs font-semibold">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
            <th className="p-4">المستخدم</th>
            <th className="p-4">الرتبة / الدور</th>
            <th className="p-4">المرحلة / التخصص</th>
            <th className="p-4">الحالة</th>
            <th className="p-4">تاريخ الانضمام</th>
            <th className="p-4">آخر تسجيل</th>
            <th className="p-4 text-left">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {users.map((user) => {
            const isActive = user.status === "active";
            return (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0B2D5B] dark:text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full font-bold text-[11px]",
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                        : user.role === "teacher"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    )}
                  >
                    {user.role === "admin" && "👑 أدمن مسؤول"}
                    {user.role === "teacher" && "👨‍🏫 مدرس محاضر"}
                    {user.role === "student" && "🎓 طالب"}
                  </span>
                </td>

                <td className="p-4 text-slate-600 dark:text-slate-300 font-bold">
                  {user.stage || "عام"}
                </td>

                <td className="p-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full font-bold text-[10px]",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    )}
                  >
                    {isActive ? "نشط 🟢" : "مجمد 🔴"}
                  </span>
                </td>

                <td className="p-4 text-slate-400">{user.createdAt}</td>
                <td className="p-4 text-slate-400">{user.lastLogin}</td>

                <td className="p-4 text-left">
                  <button
                    type="button"
                    onClick={() => onToggleStatus?.(user.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold text-xs transition-colors",
                      isActive
                        ? "bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100"
                    )}
                  >
                    {isActive ? "تجميد الحساب" : "تفعيل الحساب"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
