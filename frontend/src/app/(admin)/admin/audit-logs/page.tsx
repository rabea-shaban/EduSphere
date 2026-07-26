"use client";

import * as React from "react";
import { ShieldAlert, Search } from "lucide-react";
import { mockAuditLogs } from "@/features/admin";

export default function AdminAuditLogsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = mockAuditLogs.filter((l) => l.action.includes(search) || l.userName.includes(search));

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            سجل عمليات المنصة والحماية (Audit Logs) 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            تتبع حركات ومسارات كافة المسؤولين والمعلمين وعمليات الاعتماد بالمنصة
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في السجل..."
            className="w-full h-11 pr-10 pl-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-extrabold text-[#0B2D5B] dark:text-white">{log.action}</div>
              <div className="text-slate-400">المُنفذ: {log.userName} ({log.userRole}) • الهدف: {log.target}</div>
            </div>

            <div className="text-left text-slate-400">
              <div>{log.timestamp}</div>
              <div className="font-mono text-[10px] text-slate-400">{log.ipAddress} | {log.device}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
